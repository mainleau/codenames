import * as uuid from 'uuid';

export default class Player {
    constructor(game, socket) {
        this.game = game;
        this.socket = socket;

        this.id = uuid.v4();
        this.username = 'Player ' + this.id.slice(-3);

        this.team = null;

        socket.onmessage = message => this.handle(message);
    }

    emit(event, data) {
		this.socket.send(JSON.stringify([event, data]));
    }

    handle(message) {
        const [event, data] = JSON.parse(message.data);

        switch (event) {
            case 'choose-team':
                this.team = data.id;
                this.game.players.forEach(p => p.emit('player-changed', {
                    team: this.team,
                    player: this.id
                }))
                break;
        }
    }
}