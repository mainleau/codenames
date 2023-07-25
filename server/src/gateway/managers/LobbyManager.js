import { Collection } from '@discordjs/collection';

export default class LobbyManager extends Collection {
    constructor(io) {
        super();

        io.of('/lobby').on('connection', socket => {
            socket.emit('game-list');

            socket.onAny((name, data) => this.manage(socket, { name, data }));
        });
    }

    manage(socket, event) {
    }
}