export default class Server {

    broadcast(event, data) {
		this.players.forEach(player => player.emit(event, data));
	}
}