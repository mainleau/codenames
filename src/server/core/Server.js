export default class Server {

    broadcast(event, data) {
		this.players.forEach(player => player.emit(event, data));
	}

	broadcastOperatives(event, data) {
		this.operatives.forEach(player => player.emit(event, data));
	}

	broadcastSpymasters(event, data) {
		this.spymasters.forEach(player => player.emit(event, data));

	}
}