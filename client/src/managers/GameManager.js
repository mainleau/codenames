import Game from '../core/Game.js';
import GameInterface from '../interfaces/game/index.js';
import { Collection } from '../util';

export default class GameManager extends Collection {
    constructor(manager) {
        super();

        Object.defineProperty(this, 'manager', { value: manager });
    }

    get socketURL() {
        return `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.hostname}:8888/play`;
    }

    create() {
        const socket = io(this.socketURL);
        socket.emit('create-game');

        const game = new Game(this, socket);
        new GameInterface(this, game);
    }

    join(id) {
        const socket = io(this.socketURL);
        socket.emit('join-game', { id });

        const game = new Game(this, socket);
        new GameInterface(this, game);
    }
}