import routes from '../rest/routes.js';
import Client from '../api/Client.js';
import Authenticator from '../auth/Authenticator.js';
import GameManager from '../interfaces/game/managers/GameManager.js';
import REST from '../rest/REST.js';

// TODO: add special items for 10 first players, 100 first players, 1000, 10000 etc.
export default class Manager {
    constructor(app) {
        this.app = app;

        const token = localStorage.token;

        const options = {
            timeout: 15_000,
            cdn: location.hostname !== 'localhost'
            ? `https://cdn.${location.hostname}`
            : 'http://localhost:8886',
            gateway: location.hostname !== 'localhost'
            ? `https://games.${location.hostname}`
            : 'http://localhost:8887',
            api: location.hostname !== 'localhost'
                ? `https://api.${location.hostname}`
                : 'http://localhost:8888',
            auth: location.hostname !== 'localhost'
                ? `https://auth.${location.hostname}`
                : 'http://localhost:8889'
        }

        this.rest = new REST(token, routes, options);

        this.auth = new Authenticator(this.rest);
        this.client = new Client(this.rest);

        this.games = new GameManager(this);

        this.login();
    }

    login() {
        if(!this.rest.token) return;
        this.client.users.putMeOnline();
        const interval = setInterval(() => {
            if(!this.rest.token) return clearInterval(interval);
            this.client.users.putMeOnline();
        }, 5 * 60 * 1000);
    }
}