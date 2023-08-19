import { getTeamAveragePoints } from '../../../utils/index.js';

export default class Team {
    constructor(game, id) {
        this.id = id;

        Object.defineProperty(this, 'game', { value: game });
    }

    get averagePoints() {
        const points = this.members.map(member => member.user.points);
        return getTeamAveragePoints(points);
    };

    get members() {
        return this.game.players.filter(player => player.team === this.id);
    }

    get clues() {
        return this.game.clues.filter(clue => clue.team === this.id);
    }

    get words() {
        return this.game.words.filter(word => word.team === this.id);
    }

    get remainingWords() {
        return this.words.filter(word => !word.revealed);
    }
}
