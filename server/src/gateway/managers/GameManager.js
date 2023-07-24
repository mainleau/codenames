import { Collection } from '@discordjs/collection';
import Game from '../structures/Game.js';
import Player from '../structures/Player.js';

export default class GameManager extends Collection {
    constructor(io, client) {
        super();
		
        io.of('/play').on('connection', socket => {
			const player = new Player(socket);

			socket.onAny((name, data) => this.manage(player, socket, { name, data }));

			socket.on('disconnect', () => {

			});
        });

		Object.defineProperty(this, 'client', { value: client });
    }

    async manage(player, socket, event) {
        if(event.name === 'create-game') {
			const words = await this.client.fetchWords();
			const game = new Game(words);
			this.set(game.id, game);
			player.join(game, socket);
		}

		if(event.name === 'join-game') {
			const game = data.id ? this.get(event.data.id) : this.last();
			if(!game) return socket.emit('error', {
				message: 'GAME_UNAVAILABLE'
			});

			player.join(game, socket);
		}

    }
}