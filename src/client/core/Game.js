export default class Game {
    constructor(board) {
        this.board = board;
        this.words = null;
        this.socket = new WebSocket('ws://localhost:8888');

        this.socket.onmessage = message => this.handle(message);
    }

    handle(message) {
        const [event, data] = JSON.parse(message.data);

        switch (event) {
            case 'game-joined':
                this.words = data.words;
                this.board.rerender(this);
                break;
        }
    }
}