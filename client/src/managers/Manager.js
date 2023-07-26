import GameManager from '../managers/GameManager.js';

export default class Manager {
    constructor() {
        // this.lobby = new Lobby();
        this.games = new GameManager();
    }
}