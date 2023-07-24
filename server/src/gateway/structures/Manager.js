import GameManager from '../managers/GameManager.js';
import LobbyManager from '../managers/LobbyManager.js';
import Client from '../../core/Client.js';

export default class Manager {
    constructor(io) {
        const client = new Client();
        
        this.games = new GameManager(io, client);
        this.lobbies = new LobbyManager(io, client);
    }
}