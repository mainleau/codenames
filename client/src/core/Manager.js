import REST from '../rest/REST.js';
import routes from '../rest/routes.js';
import { isUUID } from '../utils/index.js';
import GameHandler from './GameHandler.js';

// TODO: add special items for 10 first players, 100 first players, 1000, 10000 etc.
export default class Manager {
    constructor(app) {
        this.app = app;

        const { token } = localStorage;

        this.games = new GameHandler(this.app);

        this.api = new REST(token, routes, this.app);
    }

    init() {
        const path = location.pathname.substring(1);

        if (isUUID(path)) {
            this.games.join(path);
        } else {
            this.app.goHome();
        }
    }

    // login() {
    //     if (!this.rest.token) return;
    //     this.client.users.putMeOnline();
    //     const interval = setInterval(
    //         () => {
    //             if (!this.rest.token) return clearInterval(interval);
    //             this.client.users.putMeOnline();
    //         },
    //         5 * 60 * 1000,
    //     );
    // }
}
