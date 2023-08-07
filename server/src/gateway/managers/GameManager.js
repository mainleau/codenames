import { Collection } from '@discordjs/collection';
import Game from '../structures/Game.js';
import Player from '../structures/Player.js';
import jwt from 'jsonwebtoken';

export default class GameManager extends Collection {
    constructor(io, client) {
        super();
		
        io.of('/play').on('connection', async socket => {
			const token = socket.handshake.auth.token;
			const id = socket.handshake.query.id;
			const action = socket.handshake.query.action;

			var user;
			if(token) {
				const content = jwt.verify(token, process.env.JWT_SECRET);
				user = await client.users.fetchById(content.id);
			}

			const player = new Player(socket, user);

			if(action === 'create-game') {
				const words = await this.client.words.fetch({ count: 25, random: true});
				const game = new Game(this.client, this.io, words);
				this.client.games.create(game.id, { playerCountByTeam: game.teams.map(team => team.members.size)});
				this.set(game.id, game);
				player.join(game);
			}
			
			if(action === 'join-game') {
				const game = id ? this.get(id) : this.last();
				if(!game) return socket.disconnect();
				player.join(game);
			}

			socket.onAny((name, data) => {
				this.manage(player, socket, { name, data });
			});

			socket.on('disconnect', () => {
				if(!player.currentGameId) return;

				const game = this.get(player.currentGameId);
				game.remove(player);
				this.client.games.update(game.id, { playerCountByTeam: game.teams.map(team => team.members.size) });
				if(!game.players.size) {
					setTimeout(() => {
						if(game.players.size) return;
						this.delete(game.id);
						this.client.games.remove(game.id);
					}, 30000);
				}
			});
        });

		Object.defineProperty(this, 'io', { value: io });
		Object.defineProperty(this, 'client', { value: client });
    }

    async manage(player, socket, event) {
		console.log(event);

		if(player.currentGameId) this.get(player.currentGameId).handle(player, socket, event);

		if(event.name === 'update-player') {
			if(player.currentGameId) {
				const game = this.get(player.currentGameId);
				this.client.games.update(game.id, { playerCountByTeam: game.teams.map(team => team.members.size) });
			};
		}
    }

	toJSON() {
		return this.map(game => ({
			id: game.id,
			playerCountByTeam: game.teams.map(team => team.members.size)
		}));
	}
}