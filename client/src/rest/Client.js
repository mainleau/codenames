import UserManager from './managers/UserManager.js';

export default class Client {
    constructor(routes, options) {
        this.users = new UserManager(routes, options);
    }
}