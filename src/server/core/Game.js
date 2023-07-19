import * as uuid from 'uuid';
import { Collection } from '@discordjs/collection';
import Player from './Player.js';

export default class Game {
	constructor(words) {
		this.id = uuid.v4();
		this.players = new Collection();
		this.words = words;
	}

	add(socket) {
		const player = new Player(this, socket);
		player.emit('game-joined', {
			words: this.words,
			id: player.id,
			team: 0,
			players: this.players.map(player => ({
				id: player.id,
				team: player.team
			}))
		});

		this.players.forEach(
			p => p.emit('player-joined', {
				id: player.id,
				team: player.team
			})
		);

		this.players.set(player.id, player);
	}

	start() {

		this.players.forEach((player, index) => {
			player.ws.send(JSON.stringify(['game-started',{
				gameId: this.id,
				player: player.data,
				opponent: this.players.find(p => player !== p).data,
				turn: !index
			}]));
		});
	}
}