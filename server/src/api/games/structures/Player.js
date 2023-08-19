import * as uuid from 'uuid';
import { PLAYER_FLAGS } from '../../../utils/Constants.js';

export default class Player {
    nickname = null;

    team = null;

    role = null;

    currentGameId = null;

    constructor(socket, user = {}) {
        this.socket = socket;

        this.flags = PLAYER_FLAGS.DEFAULT;

        this.user = user;
        this.id = user.id || uuid.v4();
        this.username = user.username || `Joueur ${this.id.slice(-3)}`;
    }

    get teamId() {
        return this.team;
    }

    get isLogged() {
        return !!this.user.xp;
    }

    emit(...params) {
        this.socket.emit(...params);
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            level: this.user.level,
            nickname: this.nickname,
            team: this.team,
            role: this.role,
        };
    }
}
