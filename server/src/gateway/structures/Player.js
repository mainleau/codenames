import * as uuid from 'uuid';

export default class Player {
    nickname = null;
    team = null;
    role = null;
    currentGameId = null;
    constructor(socket, user = {}) {
        this.socket = socket;

        this.user = user;
        this.id = user.id || uuid.v4();
        this.username = user.username || `Joueur ${this.id.slice(-3)}`;
    }

    emit(...params) {
        this.socket.emit(...params);
    }

    join(game) {
        game.add(this);
        this.socket.join(game.id);
        this.currentGameId = game.id;
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            nickname: this.nickname,
            team: this.team,
            role: this.role
        }
    }
}