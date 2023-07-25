import * as uuid from 'uuid';

export default class Player {
    team = null;
    role = null;
    currentGameId = null;
    constructor(socket) {
        this.socket = socket;

        this.id = uuid.v4();
        this.username = `Joueur ${this.id.slice(-3)}`;
    }

    emit(...params) {
        this.socket.emit(...params);
    }

    join(game) {
        game.add(this);
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            team: this.team,
            role: this.roll
        }
    }
}