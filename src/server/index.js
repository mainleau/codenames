import { WebSocketServer } from 'ws';
import { Collection } from '@discordjs/collection';
import Game from './core/Game.js';
import Player from './core/Player.js';
import Client from './core/Client.js';

const ws = new WebSocketServer({ port: 8888 });

const client = new Client();

const games = new Collection();

ws.on('connection', async (socket, request) => {
	var game = null;

	const params = new URLSearchParams(request.url.substring(2));
	
	if(params.get('id')) {
		game = games.get(params.get('id'));
		if(!game) return socket.close();
	}

	if (!games.size) {
		const words = await client.fetchWords();
		game = new Game(words);
		games.set(game.id, game);
	}

	const player = new Player(socket);
	player.join(game || games.last());
});