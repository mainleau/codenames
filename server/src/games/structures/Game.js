import * as uuid from 'uuid';
import Team from './Team.js';
import { GAME_FLAGS, GAME_ROLES, GAME_STATES } from '../../utils/Constants.js';
import { getLevel } from '../../utils/index.js';
import ClueManager from '../managers/ClueManager.js';
import PlayerManager from '../managers/PlayerManager.js';
import WordManager from '../managers/WordManager.js';

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
            deathWordCount: 1,
            clueWordRegex: /^[a-zA-Z0-9\\-\\ ]+$/,
            clueCountChoices: [...Array(10).keys(), '∞'],
        },
    ) {
        this.manager = manager;
        this.options = options;

        this.startTime = Date.now();

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

        this.mode = null;
        this.rules = null;
        this.state = GAME_STATES.LOBBY;

        this.manager.io = this.manager.io.to(this.id);
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

    setWords(words) {
        this.words.clear();
        words.forEach(word => this.words.set(word.id, word));
    }

    handle(player, event) {
        if (event.name === 'update-player') {
            let updated = false;
            if ('team' in event.data) {
                if (!event.data.team in this.teams) {
                    return socket.emit('error', {
                        message: 'INVALID_TEAM',
                    });
                }
                if (player.team !== event.data.team) updated = true;

                player.team = event.data.team;
            }

            if ('role' in event.data) {
                if (!event.data.role in Object.values(GAME_ROLES)) {
                    return socket.emit('error', {
                        message: 'INVALID_ROLE',
                    });
                }
                if (player.role !== event.data.role) updated = true;

                player.role = event.data.role;

                if (this.started) this.updateWords(player);
            }
        }
    }

    // Handle(player, socket, event) {

    //   if (event.name === 'update-player') {
    //     let updated = false;
    //     if ('team' in event.data) {
    //       if (!event.data.team in this.teams) {
    //         return socket.emit('error', {
    //           message: 'INVALID_TEAM',
    //         });
    //       }
    //       if (player.team !== event.data.team) updated = true;

    //       player.team = event.data.team;
    //       this.client.games.update(this.id, {
    //         playerCountByTeam: this.teams.map(team => team.members.size),
    //       });
    //     }

    //     if ('role' in event.data) {
    //       if (!event.data.role in [0, 1]) {
    //         return socket.emit('error', {
    //           message: 'INVALID_ROLE',
    //         });
    //       }
    //       if (player.role !== event.data.role) updated = true;

    //       player.role = event.data.role;

    //       if (this.started) this.updateWords(player);
    //     }

    //     if ('nickname' in event.data) {
    //       if (typeof event.data.nickname !== 'string' || event.data.nickname.length > this.options.maxNicknameLength) {
    //         return socket.emit('error', {
    //           message: 'INVALID_NICKNAME',
    //         });
    //       }
    //       if (player.nickname !== event.data.nickname) updated = true;

    //       player.nickname = event.data.nickname;
    //     }

    //     if (updated) this.io.emit('player-updated', player);
    //   }

    //   if (event.name === 'start-game') {
    //     if (this.started === true) {
    //       return socket.emit('error', {
    //         message: 'GAME_ALREADY_STARTED',
    //       });
    //     }
    //     this.start();
    //   }

    //   if (event.name === 'select-card') {
    //     this.spymasters.forEach(spymaster => {
    //       spymaster.emit('card-selected', {
    //         word: event.data.word,
    //         selected: event.data.selected,
    //       });
    //     });
    //   }

    //   if (event.name === 'give-clue') {
    //     if (player.team !== this.turn.team || player.role !== 1 || player.role !== this.turn.role) {
    //       return socket.emit('error', {
    //         message: 'NOT_YOUR_TURN',
    //       });
    //     }
    //     if (
    //       typeof event.data.word !== 'string' ||
    //       !event.data.word.match(this.options.clueWordRegex) ||
    //       event.data.word.length > this.options.maxClueWordLength
    //     ) {
    //       return socket.emit('error', {
    //         message: 'INVALID_CLUE_WORD',
    //       });
    //     }
    //     if (!this.options.clueCountChoices.includes(event.data.count)) {
    //       return socket.emit('error', {
    //         message: 'INVALID_CLUE_COUNT',
    //       });
    //     }
    //     if (
    //       event.data.relatedWords &&
    //       (!Array.isArray(event.data.relatedWords) || !this.checkRelatedWords(player.team, event.data.relatedWords))
    //     ) {
    //       return socket.emit('error', {
    //         message: 'INVALID_RELATED_WORDS',
    //       });
    //     }

    //     this.clues.set(this.clues.size + 1, {
    //       word: event.data.word,
    //       count: event.data.count,
    //       relatedWords: event.data.relatedWords ?? null,
    //       team: this.turn.team,
    //     });

    //     this.clueRemainder = event.data.count;

    //     this.io.emit('clue-forwarded', {
    //       word: event.data.word,
    //       count: event.data.count,
    //     });

    //     this.turn.role ^= true;
    //     this.players.forEach(player => this.updateClues(player));
    //   }

    //   // TODO: check if card has already been revealed before
    //   if (event.name === 'reveal-card') {
    //     if (player.team !== this.turn.team || player.role !== 0 || player.role !== this.turn.role) {
    //       return socket.emit('error', {
    //         message: 'NOT_YOUR_TURN',
    //       });
    //     }
    //     const word = this.words.get(event.data.word);

    //     const success = word.team === player.team;

    //     if (!isNaN(this.clueRemainder) && this.clueRemainder > 0) {
    //       this.clueRemainder -= 1;
    //     }

    //     // TODO: warn the user he can use 0 to "ban" a clue
    //     if ((!isNaN(this.clueRemainder) && this.clueRemainder === 0) || !success) {
    //       this.turn.team ^= true;
    //       this.turn.role ^= true;
    //     }

    //     this.io.emit('card-revealed', {
    //       word: event.data.word,
    //       team: word.team,
    //       clueRemainder: this.clueRemainder,
    //     });

    //     word.revealed = true;

    //     if (success && player.isLogged) {
    //       this.client.users.incrementStats(player.id, {
    //         words_found: 1,
    //       });
    //       this.client.users.increment(player.id, {
    //         xp: 15,
    //       });
    //     }

    //     if (!success && player.isLogged) {
    //       this.client.users.incrementStats(player.id, {
    //         words_missed: 1,
    //       });
    //       this.client.users.increment(player.id, {
    //         xp: 5,
    //       });
    //     }

    //     if ((word.team === -1 && this.teams.length === 2) || !this.teams[player.team].remainingWords.size) {
    //       this.end({
    //         winner: word.team === -1 ? +!player.team : player.team,
    //       });
    //     }
    //   }
    // }

    // checkRelatedWords(team, words) {
    //   const teamWords = this.teams[team].words;
    //   return words.every(word => !!teamWords.get(word));
    // }

    remove(player) {
        // Player.currentGameId = null;
        this.players.delete(player.id);
        this.broadcast('player-leaved', {
            id: player.id,
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
            this.rules & GAME_FLAGS.SHOW_WORDS_BEFORE_GAME_STARTED
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

    // End({ winner }) {
    //   this.endTime = Date.now();
    //   this.ended = true;
    //   this.turn.team = null;
    //   this.turn.role = null;

    //   duration = this.endTime - this.startTime;
    //   this.io.emit('game-ended', {
    //     duration,
    //     winner,
    //   });

    //   this.client.games.remove(this.id);

    //   this.players.forEach(async player => {
    //     if (player.team === null) return;

    //     let gainedXp = player.team === winner ? 100 : 25;

    //     const hasDoubleXP = player.isLogged ? !!(player.user.flags & 0x01) : false;
    //     if (hasDoubleXP) gainedXp *= 2;

    //     if (player.isLogged) {
    //       const level = getLevel(player.user.xp + gainedXp);
    //       this.client.users
    //         .increment(player.id, {
    //           xp: gainedXp,
    //           level: level - player.user.level,
    //         })
    //         .catch(() => {});
    //       this.client.users
    //         .incrementStats(player.id, {
    //           games_played: 1,
    //         })
    //         .catch(() => {});
    //       this.client.users.incrementStats(player.id, {
    //         games_won: player.team === winner ? 1 : 0,
    //         games_lost: player.team === winner ? 0 : 1,
    //       });
    //     }

    //     player.emit('game-rewards', {
    //       winner,
    //       xp: gainedXp,
    //     });
    //   });
    // }

    start() {
        this.state = GAME_STATES.STARTED;
        this.turn.team = Math.floor(Math.random() * this.teams.length);

        const shuffledWords = this.words.random(this.words.size);

        shuffledWords.slice(0, 9).forEach(word => {
            this.words.get(word.id).team = 0;
        });
        shuffledWords.slice(9, 17).forEach(word => {
            this.words.get(word.id).team = 1;
        });

        Array.from({ length: this.options.deathWordCount }, (_, index) => {
            this.words.get(shuffledWords[17 + index].id).team = -1;
        });

        this.words.filter(word => !('team' in word)).forEach(word => (word.team = null));

        this.broadcast('game-started', {
            turn: this.turn,
        });

        this.players.forEach(player => this.sendWords(player));
    }

    broadcast(event, data) {
        this.players.forEach(player => player.emit(event, data));
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
