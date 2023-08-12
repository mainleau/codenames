import Game from './Game.js';
import { GAME_MODES } from '../../utils/Constants.js';

export default class QuickGame extends Game {
  constructor(...params) {
    super(...params);

    this.mode = GAME_MODES.CUSTOM_GAME;

    this.options = {
      // randomRole: true, // TODO: make it effective
      // randomTeam: true, // TODO: make it effective
    };
  }
}
