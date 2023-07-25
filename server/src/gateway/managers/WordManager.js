import { Collection } from '@discordjs/collection';

export default class WordManager extends Collection {
    constructor(words = []) {
        super();

        words.forEach(word => this.set(word.id, word));
    }
}