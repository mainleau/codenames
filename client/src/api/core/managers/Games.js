import { Collection } from '../../../utils';

export default class Games extends Collection {
    constructor(api) {
        super();

        Object.defineProperty(this, 'api', { value: api });
    }

    async fetch() {
        const data = await this.api.games.get(this.routes.FETCH_PUBLIC_GAMES);

        return data;
    }
}
