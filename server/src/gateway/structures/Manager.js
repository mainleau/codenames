import GameManager from '../managers/GameManager.js';
import LobbyManager from '../managers/LobbyManager.js';

export default class Manager {
    constructor(io, client) {
        this.games = new GameManager(io, client);
        this.lobbies = new LobbyManager(io, client);
    }
}