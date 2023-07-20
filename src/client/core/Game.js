import { isUUID } from '../util/index.js';

export default class Game {
    constructor(board) {
        this.board = board;
        this.words = null;

        var url = `ws://${location.hostname}:8888`;

        const id = location.pathname.substring(1);
        if(isUUID(id)) url += `?id=${id}`;

        this.socket = new WebSocket(url);

        this.players = [];

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
                localStorage.setItem('id', data.id);
                history.replaceState(null, '', data.id);
                this.words = data.words;
                this.add({ id: data.id, team: data.team }, ...data.players);
                this.board.rerender(this);
                break;
            case 'team-changed':
                this.players.find(player => player.id === data.target).team = data.team;
                this.board.rerender(this);
                break;
            case 'player-joined':
                this.add({ id: data.id, team: data.team });
                this.board.rerender(this);
                break;
            case 'player-list':
                this.players = data;
                this.board.rerender(this);
        }
    }
}