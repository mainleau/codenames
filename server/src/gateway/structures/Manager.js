import GameManager from '../managers/GameManager.js';

export default class Manager {
    constructor(io, client) {
        this.games = new GameManager(io, client);
    }
}