import Games from './managers/Games.js';
import Friends from './managers/Friends.js';
import Users from './managers/Users.js';

export default class Client {
    constructor(routes, options) {
        this.games = new Games(routes, options);
        this.users = new Users(routes, options);
        this.friends = new Friends(routes, options);
    }
}