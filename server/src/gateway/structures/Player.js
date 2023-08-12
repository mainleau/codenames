import * as uuid from 'uuid';
import { PLAYER_FLAGS } from '../../utils/Constants';

export default class Player {
    nickname = null;

    team = null;

    role = null;

    currentGameId = null;

    constructor(socket, user = {}) {
        this.socket = socket;

        this.flags = PLAYER_FLAGS.NONE;

        this.user = user;
        this.id = user.id || uuid.v4();
        this.username = user.username || `Joueur ${this.id.slice(-3)}`;
    }

    get isLogged() {
        return !!this.user.id;
    }

    emit(...params) {
        this.socket.emit(...params);
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            nickname: this.nickname,
            team: this.team,
            role: this.role,
        };
    }
}
