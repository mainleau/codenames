export default class Team {
    constructor(game, id) {
        this.id = id;

        Object.defineProperty(this, 'game', { value: game });
    }

    get members() {
        return this.game.players.filter(player => player.team === this.id);
    }

    get clues() {
        return this.game.clues.filter(clue => clue.team === this.id);
    }

    get revealedWords() {
        return this.words.filter(word => word.revealed);
    }

    get remainingWordCount() {
        return (this.game.teamStarted === this.id ? 9 : 8) - this.revealedWords.size;
    }

    get words() {
        return this.game.words.filter(word => word.team === this.id);
    }
}
