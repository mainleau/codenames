import { WebSocketServer } from 'ws';
import { Collection } from '@discordjs/collection';
import Game from './core/Game.js';
import Player from './core/Player.js';
import Client from './core/Client.js';

const ws = new WebSocketServer({ port: 8888 });

const client = new Client();

const games = new Collection();

ws.on('connection', async socket => {
	const player = new Player(socket);

	socket.onmessage = async message => {
        const [event, data] = JSON.parse(message.data);

		if(event === 'game-list') {
			player.emit('game-list', games.map(game => ({
				id: game.id,
				playerCount: [game.players.filter(p => p.team === 0).size, game.players.filter(p => p.team === 1).size]
			})));
		}

		if(event === 'create-game') {
			const words = await client.fetchWords();
			const game = new Game(words);
			games.set(game.id, game);
			player.join(game, message);
		}

		if(event === 'join-game') {
			var game = null;
			if(data.id) {
				game = games.get(data.id);
				if(!game) return socket.close();
			} else {
				game = games.last();
			}
			player.join(game, message);
		}

		if(player.game) {
			player.game.handle(player, message);
		}
	}
});