import routes from '../utils/routes.js';
import Client from '../api/Client.js';
import Authenticator from '../auth/Authenticator.js';
import GameManager from '../interfaces/game/managers/GameManager.js';

// TODO: add special items for 10 first players, 100 first players, 1000, 10000 etc.
export default class Manager {
    constructor(app) {
        this.app = app;

        const authOptions = {
            baseURL: location.hostname !== 'localhost'
            ? `https://auth.${location.hostname}`
            : 'http://localhost:8889'
        }

        const apiOptions = {
            baseURL: location.hostname !== 'localhost'
            ? `https://api.${location.hostname}`
            : 'http://localhost:8888'
        }

        this.auth = new Authenticator(routes, authOptions);
        this.client = new Client(routes, apiOptions);
        this.games = new GameManager(this);
    }
}