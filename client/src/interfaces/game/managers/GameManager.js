import { Collection } from '../../../utils/index.js';
import GameInterface from '../index.js';
import Game from '../structures/Game.js';

export default class GameManager extends Collection {
    constructor(manager) {
        super();

        Object.defineProperty(this, 'manager', { value: manager });
    }

    get socketURL() {
        const url = new URL(this.manager.rest.options.api.games);
        return location.hostname !== 'localhost'
            ? `wss://${url.hostname}`
            : 'ws://localhost:8887';
    }

    create(mode) {
        const socket = io(this.socketURL, {
            auth: {
                token: this.manager.rest.token ?? null,
            },
            query: {
                mode,
                action: 'create-game',
            },
        });

        const game = new Game(this, socket);
        new GameInterface(this, game);
    }

    join(id, mode) {
        const socket = io(this.socketURL, {
            auth: {
                token: this.manager.rest.token ?? null,
            },
            query: id
                ? {
                      mode,
                      action: 'join-game',
                      id,
                  }
                : {
                      mode,
                      action: 'join-game',
                  },
        });

        const game = new Game(this, socket);
        new GameInterface(this, game);
    }
}
