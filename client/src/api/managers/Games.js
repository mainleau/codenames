import { Collection } from '../../utils';

export default class Games extends Collection {
    constructor(rest, options) {
        super();

        Object.defineProperty(this, 'rest', { value: rest });
        Object.defineProperty(this, 'options', { value: options });
    }

    async fetch() {
        const data = await this.rest.get(this.rest.routes.FETCH_GAMES, this.options);

        return data;
    }

}