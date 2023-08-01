import UserManager from './managers/UserManager.js';
import routes from './index.js';

export default class Client {
    constructor(options = {
        baseURL: location.hostname === 'localhost' ? 'localhost:8889'
            : `https://api.${location.hostname}`
    }) {
        this.users = new UserManager(routes, options);
    }
}