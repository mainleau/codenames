export default class Game {
    constructor(board) {
        this.board = board;
        this.words = null;
        this.socket = new WebSocket('ws://localhost:8888');
        this.players = [];

        this.socket.onmessage = message => this.handle(message);
    }

    emit(event, data) {
		this.socket.send(JSON.stringify([event, data]));
    }

    add(player) {
        this.players.push(player);
    }

    handle(message) {
        const [event, data] = JSON.parse(message.data);

        switch (event) {
            case 'game-joined':
                this.words = data.words;
                this.add({ id: data.id, team: data.team });
                this.board.rerender(this);
                break;
            case 'team-changed':
                this.players.find(player => player.id === data.player).team = data.team;
                this.board.rerender(this);
                break;
        }
    }
}