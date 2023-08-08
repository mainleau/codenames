import Games from './managers/Games.js';
import Friends from './managers/Friends.js';
import Users from './managers/Users.js';

export default class Client {
    constructor(rest) {
        const options = {
            baseURL: rest.options.api
        }

        this.games = new Games(rest, this, options);
        this.users = new Users(rest, this, options);
        this.friends = new Friends(rest, this, options);
    }
}