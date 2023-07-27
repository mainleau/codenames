import { Collection } from '@discordjs/collection';

export default class ClueManager extends Collection {
    constructor() {
        super();
    }

    toJSON() {
        return this.map(clue => ({
            word: clue.word,
            count: clue.count,
            relatedWords: clue.relatedWords,
            team: clue.team
        }));
    }
}