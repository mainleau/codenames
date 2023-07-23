import { WebSocketServer } from 'ws';
import { Collection } from '@discordjs/collection';
import Game from './core/Game.js';
import Player from './core/Player.js';
import Client from './core/Client.js';

const ws = new WebSocketServer({ port: 8888 });

const client = new Client();

const games = new Collection();

const players = new Collection();

ws.on('connection', async socket => {
	const player = new Player(socket);
	players.set(player.id, player);

	socket.onclose = () => {
		players.delete(player.id);
		if(player.game) {
			player.game.remove(player);
		}
	}

	socket.onmessage = async message => {
        const [event, data] = JSON.parse(message.data);

		if(event === 'leave-game') {
			const game = player.game;
			if(player.game)	player.game.remove(player);

			if(!game.players.size) setTimeout(() => {
				if(!game.players.size) {
					games.delete(game.id);
					players.forEach(p => {
						if(p.game) return;
						player.emit('game-list', games.filter(g => !g.ended).map(g => ({
							id: g.id,
							playerCount: [g.players.filter(p => p.team === 0).size, g.players.filter(p => p.team === 1).size]
						})));
					});
				}
			}, 30000)
		}

		if(event === 'game-list') {
			player.emit('game-list', games.filter(game => !game.ended).map(game => ({
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