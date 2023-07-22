export default class Server {

    broadcast(event, data) {
		this.players.forEach(player => player.emit(event, data));
	}

	broadcastOperatives(event, data, andSpectators) {
		this.operatives.forEach(player => player.emit(event, data));
		if(andSpectators) this.broadcastSpectators(event, data);
	}

	broadcastSpymasters(event, data, andSpectators) {
		this.spymasters.forEach(player => player.emit(event, data));
		if(andSpectators) this.broadcastSpectators(event, data);
	}

	broadcastSpectators(event, data) {
		this.spectators.forEach(player => player.emit(event, data));
	}
}