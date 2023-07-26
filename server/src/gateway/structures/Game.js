import * as uuid from 'uuid';
import Team from './Team.js';
import WordManager from '../managers/WordManager.js';
import PlayerManager from '../managers/PlayerManager.js';

export default class Game {
	started = false;
	ended = false;
	constructor(io, words, options = {
		teamCount: 2
	}) {
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
			}

			if('nickname' in event.data) {
				if(typeof event.data.nickname !== 'string' || event.data.nick.length > 12)
					return socket.emit('error', {
						message: 'INVALID_NICKNAME'
					});
				if(player.nickname !== event.data.nickname) updated = true;

				player.nickname = event.data.nickname;
			}

			if(updated) this.io.emit('player-updated', player);

			// if(data.role === 1) {
			// 	player.emit('word-list', this.words.map(word => {
			// 		return {
			// 			name: word.name,
			// 			team: word.team
			// 		}
			// 	}));
			// }
			// this.broadcast('team-role-changed', {
			// 	target: player.id,
			// 	team: data.team,
			// 	role: data.role
			// });
		}

			// case 'select-card':
			// 	this.broadcastSpymasters('card-selected', {
			// 		target: data.target,
			// 		selected: data.selected
			// 	});
			// 	break;
			// case 'give-clue':
			// 	this.turn.role ^= true;
			// 	this.remainder = data.count;
			// 	this.teams[this.turn.team].clues.set(data.word, {
			// 		words: data.words ?? null,
			// 		word: data.word,
			// 		count: data.count
			// 	});
			// 	this.broadcast('forwarded-clue', {
			// 		word: data.word,
			// 		count: data.count
			// 	});
			// 	break;
			// case 'use-card':
            //     const word = this.words.at(data.target);

			// 	if(!isNaN(this.remainder)) {
			// 		if(word.team === player.team && this.remainder > 0) {
			// 			this.remainder -= 1;
			// 		} else {
			// 			this.turn.team ^= true;
			// 			this.turn.role ^= true;
			// 		}
			// 	}

			// 	this.broadcast('card-used', {
			// 		word: word.index,
			// 		team: word.team,
			// 		remainder: this.remainder
			// 	});

			// 	if (word.team === -1) {
			// 		this.stop();
			// 	}
			// 	break;
			// case 'start-game':
			// 	this.started = true;
			// 	this.start();
	}

	remove(player) {
		player.currentGameId = null;
		this.players.delete(player.id);
		// this.socket.('player-leaved', {
		// 	id: player.id
		// });
	}

	add(player) {
		player.emit('game-joined', {
			id: this.id,
			turn: this.turn,
			words: this.words,
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
		// this.words.forEach(word => delete word.team);
		// const shuffledWords = this.words.random(this.words.size);

		// this.teams[0].words = shuffledWords.slice(0, 9).reduce((col, word) => {
		// 	this.words.get(word.name).team = 0;
		// 	return col.set(word.name, { name: word.name });
		// }, new Collection());
		// this.teams[1].words = shuffledWords.slice(9, 17).reduce((col, word) => {
		// 	this.words.get(word.name).team = 1;
		// 	return col.set(word.name, { name: word.name });
		// }, new Collection());

		// const deathWord = shuffledWords[17];
		// this.words.get(deathWord.name).team = -1;

		// this.words.filter(word => !('team' in word)).forEach(word => word.team = null);

		// const words = shuffledWords.map(word => word.name);

		// this.broadcastOperatives('game-started', {
		// 	turn: this.turn
		// }, true);

		// this.broadcastSpymasters('game-started', {
		// 	turn: this.turn,
		// 	words: this.words.map(word => {
		// 		return {
		// 			name: word.name,
		// 			team: word.team
		// 		}
		// 	})
		// });
	}
}