import BaseController from '../BaseController.js';
import Friends from './managers/Friends.js';
import Games from './managers/Games.js';
import Users from './managers/Users.js';

export default class CoreController extends BaseController {
    constructor(api) {
        super(api);

        this.options = {
            baseURL: location.hostname !== 'localhost'
                ? 'https://api-core.nomdecode.fun'
                : 'http://localhost:8888'
        }

        this.games = new Games(api);
        this.users = new Users(api);
        this.friends = new Friends(api);
    }
}
