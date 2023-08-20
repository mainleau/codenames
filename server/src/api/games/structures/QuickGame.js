import Game from './Game.js';
import { GAME_MODES, GAME_RULES } from '../../../utils/Constants.js';

export default class QuickGame extends Game {
    constructor(manager) {
        super(manager);

        this.mode = GAME_MODES.QUICK_GAME;

        this.rules = GAME_RULES.TEAM_ROLE_LOCK_WHEN_STARTED;
    }

    start() {
        super.start();

        const game = this.manager['QUICK_GAME'].queue.get(this.id);
        this.manager['QUICK_GAME'].queue.delete(this.id);
        this.manager['QUICK_GAME'].set(game.id, game);
    }
}
