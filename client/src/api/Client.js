import Games from './managers/Games.js';
import UserManager from './managers/UserManager.js';

export default class Client {
    constructor(routes, options) {
        this.games = new Games(routes, options);
        this.users = new UserManager(routes, options);
    }
}