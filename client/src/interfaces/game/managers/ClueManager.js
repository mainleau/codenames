import { Collection } from '../../../utils';

export default class ClueManager extends Collection {
    constructor() {
        super();
    }

    add(words) {
        this.clear();
        words.forEach(word => this.set(this.size + 1, word));
    }
}
