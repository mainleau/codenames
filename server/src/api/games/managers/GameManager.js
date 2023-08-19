import { Collection } from '@discordjs/collection';

export default class GameManager extends Collection {
    constructor(manager) {
        super();

        Object.defineProperty(this, 'manager', { value: manager });
    }

    static get [Symbol.species]() {
        return Collection;
    }

    prepareDeletion(game) {
        if(!game.players.size) {
            setTimeout(() => {
                if(game.players.size) return;
                this.delete(game.id);
            }, 30000);
        }
    }

    connect() {}

    reconnect() {}
    
    disconnect() {}
}