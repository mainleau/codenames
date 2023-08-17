import GameInterface from '../../interfaces/game/index.js';
import Game from './structures/Game.js';
import BaseController from '../BaseController.js';

export default class GameController extends BaseController {
    constructor(api, app) {
        super(api);
        this.app = app;

        this.options = {
            baseURL: location.hostname !== 'localhost'
                ? 'https://api-games.nomdecode.fun'
                : 'http://localhost:8887'
        }
    }

    get socketURL() {
        const url = new URL(this.options.baseURL);
        return location.hostname !== 'localhost'
            ? `wss://${url.hostname}`
            : `ws://${url.hostname}:8887`;
    }

    async fetch() {
        const data = await this.api.games.get(this.routes.FETCH_PUBLIC_GAMES);

        return data;
    }

    create(mode) {
        const socket = io(this.socketURL, {
            auth: {
                token: this.api.token ?? null,
            },
            query: {
                mode,
                action: 'create-game',
            },
        });

        const game = new Game(this.app, socket);
        new GameInterface(this.app, game);
    }

    join(id, mode) {
        const socket = io(this.socketURL, {
            auth: {
                token: this.api.token ?? null,
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

        const game = new Game(this.app, socket);
        new GameInterface(this.app, game);
    }
}
