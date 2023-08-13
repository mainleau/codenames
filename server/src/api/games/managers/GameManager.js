import { Collection } from '@discordjs/collection';

export default class GameManager extends Collection {
    constructor(manager) {
        super();

        Object.defineProperty(this, 'manager', { value: manager });
    }

    static get [Symbol.species]() {
        return Collection;
    }

    connect() {}

    reconnect() {}
    
    disconnect() {}
}

// If(!game.players.size) {
// 	setTimeout(() => {
// 		if(game.players.size) return;
// 		this.delete(game.id);
// 		this.client.games.remove(game.id);
// 	}, 30000);
// }
