import { isUUID } from '../util/index.js';
import Collection from './Collection.js';

export default class Game {
    constructor(board) {
        this.board = board;
        this.words = null;

        var url = `ws://${location.hostname}:8888`;

        const id = location.pathname.substring(1);
        if(isUUID(id)) url += `?id=${id}`;

        this.socket = new WebSocket(url);

        this.players = [];

        this.selectedCards = new Map();

        this.socket.onmessage = message => this.handle(message);
    }

    emit(event, data) {
		this.socket.send(JSON.stringify([event, data]));
    }

    add(...player) {
        this.players.push(...player);
    }

    handle(message) {
        const [event, data] = JSON.parse(message.data);

        switch (event) {
            case 'game-joined':
                localStorage.setItem('last-game-id', data.id);
                this.playerId = data.playerId;
                history.replaceState(null, '', data.id);
                this.words = data.words.reduce((col, word) => {
                    return col.set(word.name, { name: word.name });
                }, new Collection());
                this.add({ id: data.id, username: data.username, team: data.team, role: data.role });
                this.board.rerender(this);
                break;
            case 'team-role-changed':
                var player = this.players.find(player => player.id === data.target);
                if(player.id === this.playerId) {
                    this.team = data.team;
                    this.role = data.role
                }
                player.team = data.team;
                player.role = data.role;
                this.board.rerender(this);
                break;
            case 'username-changed':
                var player = this.players.find(player => player.id === data.target);
                player.username = data.username;
                this.board.rerender(this);
                break;
            case 'player-joined':
                this.add({ id: data.id, username: data.username, team: data.team, role: data.role });
                this.board.rerender(this);
                break;
            case 'player-list':
                this.players = data;
                this.board.rerender(this);
                break;
            case 'card-selected':
                data.selected ? this.selectedCards.set(data.target) : this.selectedCards.delete(data.target);
                this.board.rerender(this);
                break;
            case 'game-started':
                if(data.words) {
                    this.words = data.words.reduce((col, word) => {
                        return col.set(word.name, { name: word.name, team: word.team });
                    }, new Collection());
                    this.board.rerender(this);
                }
                break;
        }
    }
}