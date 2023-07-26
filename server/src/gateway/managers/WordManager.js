import { Collection } from '@discordjs/collection';

export default class WordManager extends Collection {
    constructor(words = []) {
        super();

        this.add(words);
    }

    add(words) {
        words.forEach(word => this.set(word.id, word));
    }

    toJSON({ withTeam } = { withTeam: false }) {
        return this.map(word => ({
            id: word.id,
            name: word.name,
            team: withTeam ? word.team : null
        }));
    }
}