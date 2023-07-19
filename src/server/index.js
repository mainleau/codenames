import { WebSocketServer } from 'ws';
import { Collection } from '@discordjs/collection';
import Game from './core/Game.js';
import Client from './core/Client.js';

const ws = new WebSocketServer({ port: 8888 });

const client = new Client();

const games = new Collection();

ws.on('connection', async socket => {
	if (!games.size) {
		const words = await client.fetchWords();
		const game = new Game(words);
		game.add(socket);
		games.set(game.id, game);
	} else {
		games.last().add(socket);
	}
});