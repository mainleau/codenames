import Game from '../structures/Game.js';
import GameInterface from '../index.js';
import { Collection } from '../../../utils/index.js';

export default class GameManager extends Collection {
    constructor(manager) {
        super();

        Object.defineProperty(this, 'manager', { value: manager });
    }

    get socketURL() {
        return `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.hostname}:8887/play`;
    }

    create() {
        const socket = io(this.socketURL, {
            query: {
                token: localStorage.token
            }
        });
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