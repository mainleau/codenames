import * as uuid from 'uuid';
import Socket from './Socket.js';

export default class Player extends Socket {
    constructor(socket) {
        super(socket);

        this.id = uuid.v4();
        this.username = 'Player ' + this.id.slice(-3);

        this.team = null;
    }

    join(game) {
        game.add(this);
    }
}