import { Collection } from '@discordjs/collection';

export default class Team {
    constructor() {
        this.words = null;
        this.clues = new Collection();
    }
}