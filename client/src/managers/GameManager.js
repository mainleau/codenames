import Collection from '../util/Collection.js';

export default class GameManager extends Collection {
    constructor() {}

    create() {
        this.socket.emit('create-game');
    }

    join(id) {
        this.socket.emit('join-game', { id });
    }
}