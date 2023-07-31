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
				if(!player.currentGameId) return;

				const game = this.get(player.currentGameId);
				game.remove(player);
				this.client.updateGame({ id: game.id, playerCountByTeam: game.teams.map(team => team.members.size) });
				if(!game.players.size) {
					setTimeout(() => {
						if(!game.players.size) {
							this.delete(game.id);
							this.client.removeGame(game.id);
						}
					}, 30000);
				}
			});
        });

		Object.defineProperty(this, 'io', { value: io });
		Object.defineProperty(this, 'client', { value: client });
    }

    async manage(player, socket, event) {
		console.log(event);

        if(event.name === 'create-game') {
			const words = await this.client.fetchWords();
			const game = new Game(this.io, words);
			this.client.addGame({ id: game.id, playerCountByTeam: game.teams.map(team => team.members.size)});
			this.set(game.id, game);
			player.join(game);
		}
		
		if(event.name === 'join-game') {
			const game = event.data.id ? this.get(event.data.id) : this.last();
			if(!game) return socket.emit('error', {
				message: 'GAME_UNAVAILABLE'
			});
			player.join(game);
		}

		if(player.currentGameId) this.get(player.currentGameId).handle(player, socket, event);

		if(event.name === 'update-player') {
			if(player.currentGameId) {
				const game = this.get(player.currentGameId);
				this.client.updateGame({ id: game.id, playerCountByTeam: game.teams.map(team => team.members.size) });
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