import { GAME_MODES } from '../../utils/Constants.js';
import GameManager from '../managers/GameManager.js';
import QuickGameManager from '../managers/QuickGameManager.js';

export default class Manager {
  constructor(io, client) {
    this.io = io;
    this.client = client;
    this.games = new GameManager(io, client);

    const entries = Object.entries(GAME_MODES);

    entries.forEach(([key]) => {
      this[key] = GAME_MODES[key] === GAME_MODES.QUICK_GAME ? new QuickGameManager(this) : new GameManager(io, client);
    });

    io.of('/play').on('connection', async socket => {
      const { action } = socket.handshake.query;
      const mode = parseInt(socket.handshake.query.mode);

      if (action === 'join-game') {
        if (Object.values(GAME_MODES).includes(mode)) {
          const [key] = entries.find(([key]) => GAME_MODES[key] === mode);
          this[key].connect(socket);
        }
      }
    });
  }
}
