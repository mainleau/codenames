import Game from './Game.js';
import { GAME_MODES } from '../../utils/Constants.js';

export default class CustomGame extends Game {
    constructor(...params) {
        super(...params);

        this.mode = GAME_MODES.CUSTOM_GAME;
        this.privacy = null;

        this.options = {
            // RandomRole: true, // TODO: make it effective
            // randomTeam: true, // TODO: make it effective
        };
    }

    get host() {
        return this.players.get(this.hostId);
    }

    handle(player, event) {
        super.handle(player, event);

        if (event.name === 'update-game' && player.id === this.hostId) {
            this.name = event.data.name;
            this.privacy = event.data.privacy;
            this.rules = event.data.rules;
            this.settings = event.data.settings;
            this.broadcast('game-updated', this);
        }
    }

    toJSON() {
        return {
            ...super.toJSON(),
            privacy: this.privacy,
            hostId: this.hostId,
        };
    }
}
