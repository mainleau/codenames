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
            auth: {
                token: this.manager.rest.token ?? null,
            },
            query: {
                action: 'create-game'
            }
        });

        const game = new Game(this, socket);
        new GameInterface(this, game);
    }

    join(id) {
        const socket = io(this.socketURL, {
            auth: {
                token: this.manager.rest.token ?? null
            },
            query: id ? {
                action: 'join-game',
                id
            } : {
                action: 'join-game',
                mode: 0x00
            }
        });

        const game = new Game(this, socket);
        new GameInterface(this, game);
    }
}