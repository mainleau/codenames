import Collection from '../util/Collection.js';

export default class Lobby {
    constructor() {
        var url = `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.hostname}:8888/lobby`;

        this.socket = io(url, { transports: ['websocket'] });

        this.socket.on('connect', () => {
            this.socket.emit('game-list');
        });

        this.socket.onAny(this.handle);

        this.games = new Collection();
    }

    handle(...event) {
        
        if(event.name === 'game-list') {
            this.games = event.data.reduce((col, game) => col.set(game.id, game), new Collection());
        }
    }


}