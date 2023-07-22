import * as uuid from 'uuid';
import { Collection } from '@discordjs/collection';
import Server from './Server.js';
import Team from './Team.js';

export default class Game extends Server {
	constructor(words) {
		super();

		this.id = uuid.v4();
		this.words = words.reduce((col, name, index) => col.set(name, { name, index }), new Collection());

		this.players = new Collection();
		this.teams = [new Team(), new Team()];

		this.started = false;

		this.turn = {
			team: null,
			role: 1
		}
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

	get lastClue() {
        return this.teams[this.turn.team]?.clues.last() || {};
    }

	handle(player, message) {
        const [event, data] = JSON.parse(message.data);

        switch (event) {
            case 'change-team-role':
				player.team = data.team;
				player.role = data.role
				if(data.role === 1) {
					player.emit('word-list', this.words.map(word => {
						return {
							name: word.name,
							team: word.team
						}
					}));
				}
                this.broadcast('team-role-changed', {
					target: player.id,
                    team: data.team,
					role: data.role
                });
                break;
			case 'change-username':
				player.username = data.username;
				this.broadcast('username-changed', {
					target: player.id,
					username: data.username
				});
				break;
			case 'select-card':
				this.broadcastSpymasters('card-selected', {
					target: data.target,
					selected: data.selected
				});
				break;
			case 'give-clue':
				this.turn.role ^= true;
				this.remainder = data.count;
				this.teams[this.turn.team].clues.set(data.word, {
					words: data.words ?? null,
					word: data.word,
					count: data.count
				});
				this.broadcast('forwarded-clue', {
					word: data.word,
					count: data.count
				});
				break;
			case 'use-card':
                const word = this.words.at(data.target);

				if(!isNaN(this.remainder)) {
					if(word.team === player.team && this.remainder > 0) {
						this.remainder -= 1;
					} else {
						this.turn.team ^= true;
						this.turn.role ^= true;
					}
				}

				this.broadcast('card-used', {
					word: word.index,
					team: word.team,
					remainder: this.remainder
				});

				if (word.team === -1) {
					this.stop();
				}
				break;
			case 'start-game':
				this.started = true;
				this.start();
        }
    }

	add(player) {
		player.emit('game-joined', {
			id: this.id,
			playerId: player.id,
			username: player.username,
			turn: this.turn,
			words: this.words.map(word => ({ name: word.name }))
		});

		this.broadcast('player-joined', {
			id: player.id,
			username: player.username,
			team: player.team,
			role: player.role
		});

		this.players.set(player.id, player);

		player.emit('player-list', this.players.map(p => ({
			id: p.id,
			username: p.username,
			team: p.team,
			role: p.role
		})));
	}

	stop() {
		this.turn.team = null;
		this.turn.role = null;

		this.broadcast('game-ended')
	}

	start() {
		this.started = true;
		this.turn.team = Math.round(Math.random());
		this.words.forEach(word => delete word.team);
		const shuffledWords = this.words.random(this.words.size);

		this.teams[0].words = shuffledWords.slice(0, 9).reduce((col, word) => {
			this.words.get(word.name).team = 0;
			return col.set(word.name, { name: word.name });
		}, new Collection());
		this.teams[1].words = shuffledWords.slice(9, 17).reduce((col, word) => {
			this.words.get(word.name).team = 1;
			return col.set(word.name, { name: word.name });
		}, new Collection());

		const deathWord = shuffledWords[17];
		this.words.get(deathWord.name).team = -1;

		this.words.filter(word => !('team' in word)).forEach(word => word.team = null);

		const words = shuffledWords.map(word => word.name);

		this.broadcastOperatives('game-started', {
			turn: this.turn
		}, true);

		this.broadcastSpymasters('game-started', {
			turn: this.turn,
			words: this.words.map(word => {
				return {
					name: word.name,
					team: word.team
				}
			})
		});
	}
}