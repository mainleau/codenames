import { GAME_MODES } from '../../../utils/Constants.js';
import CustomGameManager from '../managers/CustomGameManager.js';
import GameManager from '../managers/GameManager.js';
import QuickGameManager from '../managers/QuickGameManager.js';

export default class Manager {
    constructor(io, client) {
        this.io = io;
        this.client = client;
        this.games = new GameManager(io, client);

        const entries = Object.entries(GAME_MODES);

        entries.forEach(([key]) => {
            this[key] =
                GAME_MODES[key] === GAME_MODES.QUICK_GAME
                    ? new QuickGameManager(this)
                    : GAME_MODES[key] === GAME_MODES.CUSTOM_GAME
                    ? new CustomGameManager(this)
                    : new GameManager(this);
        });

        io.on('connection', socket => {
            const { action } = socket.handshake.query;
            var mode = parseInt(socket.handshake.query.mode);

            if (!mode) {
                entries.forEach(([key]) => {
                    let game = this[key].find(
                        game => game.id === socket.handshake.query.id,
                    ) || this[key].queue?.find(
                        game => game.id === socket.handshake.query.id,
                    );
                    if (game) {
                        return mode = game.mode;
                    }
                });
            }

            if (action === 'join-game' || action === 'create-game') {
                if (Object.values(GAME_MODES).includes(mode)) {
                    const [key] = entries.find(([key]) => GAME_MODES[key] === mode);
                    this[key].connect(socket);
                }
            }
        });
    }
}
