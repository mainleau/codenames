import Game from './Game.js';
import { GAME_MODES, GAME_RULES } from '../../../utils/Constants.js';

export default class CustomGame extends Game {
    constructor(...params) {
        super(...params);

        this.mode = GAME_MODES.CUSTOM_GAME;
        this.privacy = null;

        this.rules = GAME_RULES.NICKNAMES_ALLOWED;
    }

    get host() {
        return this.players.get(this.hostId);
    }

    handle(player, event) {
        super.handle(player, event);

        if (event.name === 'update-game' && player.id === this.hostId) {
            var updated = false;

            if ('name' in event.data) {
                if(this.name !== event.data.name) updated = true;
                this.name = event.data.name;
            }
            if ('privacy' in event.data) {
                if(this.privacy !== event.data.privacy) updated = true;
                this.privacy = event.data.privacy;
            }
            if ('rules' in event.data) {
                if(this.rules !== event.data.rules) updated = true;
                this.rules = event.data.rules;
            }
            if ('settings' in event.data) {
                if(this.settings !== event.data.settings) updated = true;
                this.settings = event.data.settings;
            }

            if(updated) this.broadcast('game-updated', this);
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
