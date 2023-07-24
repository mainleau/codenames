import ClueManager from '../managers/ClueManager.js';

export default class Team {
    constructor(game, id) {
        this.id = id;
        this.clues = new ClueManager();
    
        Object.defineProperties(this, 'game', { value: game });
    }

    get members() {
        return this.game.players.filter(player => player.team === this.id);
    }

    get words() {
        return this.game.words.filter(word => word.team === this.id);
    }
}