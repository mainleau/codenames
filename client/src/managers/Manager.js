import Client from '../core/Client.js';
import GameManager from '../managers/GameManager.js';

export default class Manager {
    constructor() {
        this.client = new Client();
        this.games = new GameManager(this);
    }
}