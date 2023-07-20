import * as uuid from 'uuid';
import { Collection } from '@discordjs/collection';
import Server from './Server.js';

export default class Game extends Server {
	constructor(words) {
		super();

		this.id = uuid.v4();
		this.players = new Collection();
		this.words = words;
	}

	handle(player, message) {
        const [event, data] = JSON.parse(message.data);

        switch (event) {
            case 'change-team':
                player.team = data.team;
                this.broadcast('team-changed', {
                    target: player.id,
                    team: data.team
                });
                break;
        }
    }

	add(player) {
        player.socket.onmessage = message => this.handle(player, message);

		player.emit('game-joined', {
			id: this.id,
			words: this.words
		});

		this.broadcast('player-joined', {
			id: player.id,
			team: player.team
		});

		this.players.set(player.id, player);

		player.emit('player-list', this.players.map(p => ({ id: p.id, team: p.team })));
	}
}