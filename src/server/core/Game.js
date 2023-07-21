import * as uuid from 'uuid';
import { Collection } from '@discordjs/collection';
import Server from './Server.js';
import Team from './Team.js';

export default class Game extends Server {
	constructor(words) {
		super();

		this.id = uuid.v4();
		this.players = new Collection();
		this.teams = [new Team(), new Team()]
		this.words = words.reduce((col, name) => col.set(name, { name }), new Collection());
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

	handle(player, message) {
        const [event, data] = JSON.parse(message.data);

        switch (event) {
            case 'change-team-role':
				player.team = data.team;
				player.role = data.role
                this.broadcast('team-role-changed', {
					target: player.id,
                    team: data.team,
					role: data.role
                });
				this.start();
                break;
			case 'change-username':
				player.username = data.username;
				this.broadcast('username-changed', {
					target: player.id,
					username: data.username
				});
				break;
			case 'card-selected':
				this.broadcastSpymasters('card-selected', {
					target: data.target,
					selected: data.selected
				});
				break;
        }
    }

	add(player) {
        player.socket.onmessage = message => this.handle(player, message);

		player.emit('game-joined', {
			id: this.id,
			playerId: player.id,
			username: player.username,
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

	start() {
		const shuffledWords = this.words.random(this.words.size);

		this.teams[0].words = shuffledWords.slice(0, 9).reduce((col, word) => {
			return col.set(word.name, { name: word.name });
		}, new Collection());
		this.teams[1].words = shuffledWords.slice(9, 17).reduce((col, word) => {
			return col.set(word.name, { name: word.name });
		}, new Collection());

		const deathWord = shuffledWords[17];

		const words = shuffledWords.map(word => word.name);

		this.broadcastSpymasters('game-started', {
			words: this.words.map(word => {
				const index = words.indexOf(word.name);
				return {
					name: word.name,
					team: index < 9 ? 0
						: index < 17 ? 1
						: index === 17 ? -1
						: null
				}
			})
		});
	}
}