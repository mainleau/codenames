import Game from './Game.js';
import { GAME_MODES, GAME_PRIVACY, GAME_RULES } from '../../utils/Constants.js';

export default class QuickGame extends Game {
    constructor(...params) {
        super(...params);

        this.mode = GAME_MODES.QUICK_GAME;

        this.rules = GAME_RULES.RANDOM_ROLE | GAME_RULES.RANDOM_TEAM;
    }
}
