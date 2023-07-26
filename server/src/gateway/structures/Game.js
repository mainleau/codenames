import * as uuid from 'uuid';
import Team from './Team.js';
import WordManager from '../managers/WordManager.js';
import PlayerManager from '../managers/PlayerManager.js';

export default class Game {
	started = false;
	ended = false;
	clueRemainer = null;
	constructor(io, words, options = {
		teamCount: 2,
		maxClueWordLength: 12,
		clueCountChoices: [...Array(10).keys(), '∞']
	}) {
		this.options = options;

		this.id = uuid.v4();
		this.words = new WordManager(words);

		this.players = new PlayerManager();
		this.teams = Array.from({ length: options.teamCount }, (_, index) => new Team(this, index));

		this.turn = {
			team: null,
			role: 1
		}

		this.io = io.of('/play').to(this.id);
	}

	get spectators() {
		return this.players.filter(player => player.team === null);
	}

	get operatives() {
		return this.players.filter(player => player.role === 0);
	}

	get spymasters() {
		return this.players.filter(player => player.role === 1);
	}

	handle(player, socket, event) {
		var updated = false;

		if(event.name === 'update-player') {
			if('team' in event.data) {
				if(!event.data.team in this.teams)
					return socket.emit('error', {
						message: 'INVALID_TEAM'
					});
				if(player.team !== event.data.team) updated = true;

				player.team = event.data.team;
			}

			if('role' in event.data) {
				if(!event.data.role in [0, 1])
					return socket.emit('error', {
						message: 'INVALID_ROLE'
					});
				if(player.role !== event.data.role) updated = true;

				player.role = event.data.role;

				this.updateWords(player);
			}

			if('nickname' in event.data) {
				if(typeof event.data.nickname !== 'string' || event.data.nickname.length > 12)
					return socket.emit('error', {
						message: 'INVALID_NICKNAME'
					});
				if(player.nickname !== event.data.nickname) updated = true;

				player.nickname = event.data.nickname;
			}

			if(updated) this.io.emit('player-updated', player);
		}

		if(event.name === 'start-game') {
			if(this.started === true) {
				return socket.emit('error', {
					message: 'GAME_ALREADY_STARTED'
				});
			}
			this.start();
		}

		if(event.name === 'select-card') {
			this.spymasters.forEach(spymaster => {
				spymaster.emit('card-selected', {
					id: data.id,
					selected: data.selected
				});
			});
		}

		if(event.name === 'give-clue') {
			if(player.team !== this.turn.team || player.role !== 1)
				return socket.emit('error', {
					message: 'INVALID_TURN_OR_ROLE'
				});

			if(typeof data.word !== 'string' || data.word.length > this.options.maxClueWordLength)
				return socket.emit('error', {
					message: 'INVALID_CLUE_WORD'
				});
			if(typeof data.count !== 'number' || this.options.clueCountChoices.includes(data.count))
				return socket.emit('error', {
					message: 'INVALID_CLUE_COUNT'
				});
			if(data.relatedWords && (
				!Array.isArray(data.relatedWords) || !this.checkRelatedWords(player.team, data.relatedWords
			)))
				return socket.emit('error', {
					message: 'INVALID_RELATED_WORDS'
				});
			
			this.teams[this.turn.team].clues.set(this.teams[this.turn.team].clues.size + 1, {
				word: data.word,
				count: data.count,
				relatedWords: data.relatedWords ?? null
			});

			this.clueRemainer = data.count;

			this.io.emit('forwarded-clue', {
				word: data.word,
				count: data.count
			});

			this.turn.role ^= true;
		}

		// TODO: check if card has already been revealed before
		if(event.name === 'reveal-card') {
			const word = this.words.at(data.word);

			const success = word.team === player.team;

			if(!isNaN(this.clueRemainer) && this.clueRemainer > 0) {
				this.clueRemainer -= 1;
			}

			// TODO: warn the user he can use 0 to "ban" a clue
			if((!isNaN(this.clueRemainer) && this.clueRemainer === 0) || !success) {
				this.turn.team ^= true;
				this.turn.role ^= true;
			}

			this.io.emit('card-revealed', {
				word: data.word,
				team: word.team,
				clueRemainer: this.clueRemainer
			});

			if(word.team === -1) this.stop();
		}
	}

	checkRelatedWords(team, words) {
		const teamWords = this.teams[team].words;
		return words.every(word => {
			return teamWords.get(word) ? true : false;
		});
	}

	remove(player) {
		player.currentGameId = null;
		this.players.delete(player.id);
		this.io.emit('player-leaved', {
			id: player.id
		});
	}

	add(player) {
		// TODO: show words before game started option
		// TODO: shuffle words option 
		player.emit('game-joined', {
			id: this.id,
			player
		});

		this.io.emit('player-joined', player);

		this.players.set(player.id, player);

		player.emit('player-list', this.players);
	}

	stop() {
		// this.broadcast('game-ended');
	}

	start() {
		this.started = true;
		this.turn.team = Math.floor(Math.random() * (this.teams.length + 1));

		const shuffledWords = this.words.random(this.words.size);

		shuffledWords.slice(0, 9).forEach(word => {
			this.words.get(word.id).team = 0;
		});
		shuffledWords.slice(9, 17).forEach(word => {
			this.words.get(word.id).team = 1;
		});

		this.words.get(shuffledWords[17].id).team = -1;

		this.words.filter(word => !('team' in word)).forEach(word => word.team = null);

		this.io.emit('game-started', {
			turn: this.turn
		});

		this.players.forEach(player => this.updateWords(player));
	}

	updateWords(player) {
		player.emit('word-list',
			player.role === 1 ? this.words.toJSON({ withTeam: true })
			: this.words.toJSON()
		);	
	}
}