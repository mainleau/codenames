import { Collection } from '../../../utils';

export default class WordManager extends Collection {
    constructor(words = []) {
        super();

        this.add(words);
    }

    add(words) {
        this.clear();
        words.forEach(word => this.set(word.id, word));
    } 
}