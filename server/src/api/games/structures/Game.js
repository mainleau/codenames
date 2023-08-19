import * as uuid from 'uuid';
import Team from './Team.js';
import { GAME_RULES, GAME_ROLES, GAME_STATES, USER_FLAGS } from '../../../utils/Constants.js';
import { getLevel } from '../../../utils/index.js';
import ClueManager from '../managers/ClueManager.js';
import PlayerManager from '../managers/PlayerManager.js';
import WordManager from '../managers/WordManager.js';
import Player from './Player.js';

export default class Game {
    started = false;
    ended = false;
    clueRemainder = null;
    name = null;
    constructor(
        manager,
        options = {
            teamCount: 2,
            maxClueWordLength: 16,
            maxNicknameLength: 16,
            clueWordRegex: /^[a-zA-Z0-9\\-\\ ]+$/,
            clueCountChoices: [...Array(10).keys(), '∞'],
        },
    ) {
        this.manager = manager;
        this.options = options;

        this.startTime = Date.now();
        this.endTime = null;

        this.id = uuid.v4();
        this.clues = new ClueManager();

        this.words = new WordManager();
        this.players = new PlayerManager();
        this.teams = Array.from(
            { length: options.teamCount },
            (_, index) => new Team(this, index),
        );

        this.turn = {
            team: null,
            role: GAME_ROLES.SPYMASTER,
        };

        this.settings = {
            deathWordCount: 1,
        }

        this.mode = null;
        this.rules = null;
        this.state = GAME_STATES.LOBBY;

        this.manager.io = this.manager.io.to(this.id);
    }

    get duration() {
        return this.endTime - this.startTime;
    }

    get spectators() {
        return this.players.filter(player => player.team === null);
    }

    get operatives() {
        return this.players.filter(player => player.role === GAME_ROLES.OPERATIVE);
    }

    get spymasters() {
        return this.players.filter(player => player.role === GAME_ROLES.SPYMASTER);
    }

    broadcast(event, data) {
        this.players.forEach(player => player.emit(event, data));
    }

    handle(player, event) {
        if (event.name === 'start-game') {
            try {
                this.start();
            } catch(error) {
                return player.socket.emit('error', {
                    message: error.message,
                });
            }
        }

        if (event.name === 'update-player') {
            try {
                this.update(player, event.data);
            } catch(error) {
                return player.socket.emit('error', {
                    message: error.message,
                });
            }
        }

        if (event.name === 'select-card') {
            this.spymasters.forEach(spymaster => {
                spymaster.emit('card-selected', {
                    word: event.data.word,
                    selected: event.data.selected,
                });
            });
        }

        if (event.name === 'give-clue') {
            try {
                this.giveClue(player, event.data);
            } catch (error) {
                return player.socket.emit('error', {
                    message: error.message
                });
            }
        }

        // TODO: check if card has already been revealed before
        if (event.name === 'reveal-card') {
            try {
                this.revealCard(player, event.data);
            } catch (error) {
                return player.socket.emit('error', {
                    message: error.message
                });
            }
        }
    }

    start() {
        if (this.state === GAME_STATES.STARTED) {
            // throw new Error('GAME_ALREADY_STARTED');
            return;
        }

        this.state = GAME_STATES.STARTED;
        this.turn.team = Math.floor(Math.random() * this.teams.length);

        const shuffledWords = this.words.random(this.words.size);

        shuffledWords.slice(0, 9).forEach(word => {
            this.words.get(word.id).team = 0;
        });
        shuffledWords.slice(9, 17).forEach(word => {
            this.words.get(word.id).team = 1;
        });

        Array.from({ length: this.settings.deathWordCount }, (_, index) => {
            this.words.get(shuffledWords[17 + index].id).team = -1;
        });

        this.words.filter(word => !('team' in word)).forEach(word => (word.team = null));

        this.broadcast('game-started', {
            turn: this.turn,
        });

        this.players.forEach(player => this.sendWords(player));
    }

    end({ winner }) {
        this.endTime = Date.now();
        this.ended = true;
        this.state = GAME_STATES.ENDED;
        this.turn.team = null;
        this.turn.role = null;
  
        this.broadcast('game-ended', {
          duration: this.duration,
          winner,
        });
  
        this.manager.client.games.remove(this.id);
        
        this.reward(winner);
    }

    reward(winner) {
        this.players.forEach(async player => {
            if (player.role === GAME_ROLES.SPECTATOR) return;
    
            let gainedXp = player.team === winner ? 100 : 25;
    
            const hasDoubleXP = player.isLogged ? player.user.flags & USER_FLAGS.EARLY_BIRD : false;
            if (hasDoubleXP) gainedXp *= 2;
    
            if (player.isLogged) {
                const level = getLevel(player.user.xp + gainedXp);
                this.manager.client.users
                    .increment(player.id, {
                        xp: gainedXp,
                        level: level - player.user.level,
                    })
                    .catch(() => {});
                this.manager.client.users
                    .incrementStats(player.id, {
                        games_played: 1,
                    })
                    .catch(() => {});
                this.manager.client.users.incrementStats(player.id, {
                    games_won: player.team === winner ? 1 : 0,
                    games_lost: player.team === winner ? 0 : 1,
                });
            }
    
            player.emit('game-rewards', {
                winner,
                xp: gainedXp,
            });
        });
    }

    add(player) {
        player.currentGameId = this.id;
        player.socket.join(this.id);
        // TODO: show words before game started option
        // TODO: shuffle words option
        player.socket.emit('game-joined', {
            ...this.toJSON(),
            player,
        });

        if (
            this.state === GAME_STATES.STARTED ||
            this.rules & GAME_RULES.SHOW_WORDS_BEFORE_GAME_STARTED
        ) {
            this.sendWords(player);
        }

        if (this.state === GAME_STATES.STARTED) {
            this.sendClues(player);
        }

        this.players.set(player.id, player);
        this.manager.io.emit('player-joined', player);

        player.emit('player-list', this.players);
    }

    remove(player) {
        // Player.currentGameId = null;
        if(this.state === GAME_STATES.LOBBY) this.players.delete(player.id);
        this.broadcast('player-leaved', {
            id: player.id,
        });
    }

    rejoin(socket, user) {
        var player = this.players.get(user.id);

        if (player) {
            player.socket = socket;
            player.user = user;
        } else {
            player = new Player(socket, user);
            this.add(player);
        }

        socket.emit('game-joined', {
            ...this.toJSON(),
            player: player
        });
        socket.emit('player-list', this.players);
        socket.emit('word-list',
        player.role === GAME_ROLES.SPYMASTER
            ? this.words.toJSON({ withTeam: true })
            : this.words.toJSON()
        );
        socket.emit('clue-list', this.clues);

        socket.join(this.id);
        return player;
    }

    setWords(words) {
        this.words.clear();
        words.forEach(word => this.words.set(word.id, word));
    }

    update(player, data, force = false) {
        if(
            (this.rules & GAME_RULES.TEAM_ROLE_LOCK
            || (this.state === GAME_STATES.STARTED && TEAM_ROLE_LOCK_WHEN_STARTED)) && !force
        ) {
            throw new Error('TEAM_ROLE_LOCKED');
        }
        var updated = false;

        if ('team' in data) {
            if (!data.team in this.teams) {
                throw new Error('INVALID_TEAM');
            }
            if (player.team !== data.team) updated = true;

            player.team = data.team;
        }

        if ('role' in data) {
            if (!data.role in Object.values(GAME_ROLES)) {
                throw new Error('INVALID_ROLE');
            }
            if (player.role !== data.role) updated = true;

            player.role = data.role;

            if (this.state === GAME_STATES.STARTED) this.sendWords(player);
        }

        if('nickname' in data && (this.rules & GAME_RULES.NICKNAMES_ALLOWED)) {
            if(
                typeof data.nickname !== 'string' || data.nickname.length < 1
                    || data.nickname.length > this.options.maxNicknameLength
            ) {
                throw new Error('INVALID_NICKNAME');
            }
                
            if(player.nickname !== data.nickname) updated = true;

            player.nickname = data.nickname;
        }

        if(updated) this.broadcast('player-updated', player);
    }

    giveClue(player, data) {
        if (player.team !== this.turn.team || player.role !== 1 || player.role !== this.turn.role) {
            throw new Error('NOT_YOUR_TURN');
        }
        if (
            typeof data.word !== 'string' ||
            !data.word.match(this.options.clueWordRegex) ||
            data.word.length > this.options.maxClueWordLength
        ) {
            throw new Error('INVALID_CLUE_WORD');
        }
        if (!this.options.clueCountChoices.includes(data.count)) {
            throw new Error('INVALID_CLUE_COUNT');
        }
        if (
            data.relatedWords &&
            (!Array.isArray(data.relatedWords) || !this.checkRelatedWords(player.team, data.relatedWords))
        ) {
            throw new Error('INVALID_RELATED_WORDS');
        }

        this.clues.set(this.clues.size + 1, {
            word: data.word,
            count: data.count,
            relatedWords: data.relatedWords ?? null,
            team: this.turn.team,
        });
  
        this.clueRemainder = data.count;
  
        this.broadcast('clue-forwarded', {
            word: data.word,
            count: data.count,
        });
  
        this.turn.role ^= true;
        this.players.forEach(player => this.sendClues(player));
    }

    revealCard(player, data) {
        if (player.team !== this.turn.team || player.role !== 0 || player.role !== this.turn.role) {
            throw new Error('NOT_YOUR_TURN');
        }

        const word = this.words.get(data.word);

        const success = word.team === player.team;

        if (!isNaN(this.clueRemainder) && this.clueRemainder > 0) {
            this.clueRemainder -= 1;
        }

        // TODO: warn the user he can use 0 to "ban" a clue
        if ((!isNaN(this.clueRemainder) && this.clueRemainder === 0) || !success) {
            this.turn.team ^= true;
            this.turn.role ^= true;
        }

        this.broadcast('card-revealed', {
            word: data.word,
            team: word.team,
            clueRemainder: this.clueRemainder,
        });

        word.revealed = true;

        if (success && player.isLogged) {
            this.manager.client.users.incrementStats(player.id, {
                words_found: 1,
            });
            this.manager.client.users.increment(player.id, {
                xp: 15,
            });
        }

        if (!success && player.isLogged) {
            this.manager.client.users.incrementStats(player.id, {
                words_missed: 1,
            });
            this.manager.client.users.increment(player.id, {
                xp: 5,
            });
        }

        if ((word.team === -1 && this.teams.length === 2) || !this.teams[player.team].remainingWords.size) {
            this.end({
                winner: word.team === -1 ? +!player.team : player.team,
            });
        }
    }

    checkRelatedWords(team, words) {
      const teamWords = this.teams[team].words;
      return words.every(word => !!teamWords.get(word));
    }

    sendClues(player) {
        player.emit('clue-list', this.clues);
    }

    sendWords(player) {
        player.emit(
            'word-list',
            player.role === GAME_ROLES.SPYMASTER
                ? this.words.toJSON({ withTeam: true })
                : this.words.toJSON(),
        );
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            mode: this.mode,
            rules: this.rules,
            state: this.state,
            startTime: this.startTime,
            turn: this.turn,
            playerCountByTeam: this.teams.map(team => team.members.size),
        };
    }
}
