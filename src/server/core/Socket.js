export default class Socket {
    constructor(socket) {
        this.socket = socket;
    }

    emit(event, data) {
        this.socket.send(JSON.stringify([event, data]));
    }
}