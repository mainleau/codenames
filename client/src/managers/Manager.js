import GameManager from '../managers/GameManager.js';

export default class Manager {
    constructor() {
        this.games = new GameManager();
    }
}