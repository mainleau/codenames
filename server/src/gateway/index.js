import * as dotenv from 'dotenv';
import * as https from 'https';
import * as http from 'http';
import * as io from 'socket.io';
import * as fs from 'fs';
import Manager from './structures/Manager.js';

dotenv.config();

const httpServer = process.env.NODE_ENV === 'production'
	? https.createServer({
		cert: fs.readFileSync(process.env.CERT_PATH),
		key: fs.readFileSync(process.env.KEY_PATH)
	})
	: http.createServer();

const websocketServer = new io.Server(httpServer, {
	cors: {
		origin: '*'
	}
});

const manager = new Manager(websocketServer);

httpServer.listen(8888);


// ws.on('connection', async socket => {
// 	const player = new Player(socket);
// 	players.set(player.id, player);

// 	socket.onclose = () => {
// 		players.delete(player.id);
// 		if(player.game) {
// 			player.game.remove(player);
// 		}
// 	}

// 	socket.onmessage = async message => {
//         const [event, data] = JSON.parse(message.data);

// 		if(event === 'leave-game') {
// 			const game = player.game;
// 			if(player.game)	player.game.remove(player);

// 			if(!game.players.size) setTimeout(() => {
// 				if(!game.players.size) {
// 					games.delete(game.id);
// 					players.forEach(p => {
// 						if(p.game) return;
// 						player.emit('game-list', games.filter(g => !g.ended).map(g => ({
// 							id: g.id,
// 							playerCount: [g.players.filter(p => p.team === 0).size, g.players.filter(p => p.team === 1).size]
// 						})));
// 					});
// 				}
// 			}, 30000)
// 		}

// 		if(event === 'game-list') {
// 			player.emit('game-list', games.filter(game => !game.ended).map(game => ({
// 				id: game.id,
// 				playerCount: [game.players.filter(p => p.team === 0).size, game.players.filter(p => p.team === 1).size]
// 			})));
// 		}

// 		if(event === 'create-game') {
// 			const words = await client.fetchWords();
// 			const game = new Game(words);
// 			games.set(game.id, game);
// 			player.join(game, message);
// 		}

// 		if(event === 'join-game') {
// 			var game = null;
// 			if(data.id) {
// 				game = games.get(data.id);
// 				if(!game) return socket.close();
// 			} else {
// 				game = games.last();
// 			}
// 			player.join(game, message);
// 		}

// 		if(player.game) {
// 			player.game.handle(player, message);
// 		}
// 	}
// });