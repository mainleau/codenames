import { Collection } from '../../../utils/index.js';
import GameInterface from '../index.js';
import Game from '../structures/Game.js';

export default class GameManager extends Collection {
  constructor(manager) {
    super();

    Object.defineProperty(this, 'manager', { value: manager });
  }

  get socketURL() {
    const url = new URL(this.manager.rest.options.api.games);
    return location.hostname !== 'localhost' ? `wss://${url.hostname}/play` : 'ws://localhost:8887';
  }

  create() {
    const socket = io(this.socketURL, {
      auth: {
        token: this.manager.rest.token ?? null,
      },
      query: {
        action: 'create-game',
      },
    });

    const game = new Game(this, socket);
    new GameInterface(this, game);
  }

  join(id) {
    const socket = io(this.socketURL, {
      auth: {
        token: this.manager.rest.token ?? null,
      },
      query: id
        ? {
            action: 'join-game',
            id,
          }
        : {
            action: 'join-game',
            mode: 0x00,
          },
    });

    const game = new Game(this, socket);
    new GameInterface(this, game);
  }
}
