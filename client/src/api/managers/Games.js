import { Collection } from '../../utils';

export default class Games extends Collection {
    constructor(rest, client, options) {
        super();

        Object.defineProperty(this, 'rest', { value: rest });
        Object.defineProperty(this, 'client', { value: client });
        Object.defineProperty(this, 'options', { value: options });

    }

    async fetch() {
        const data = await this.rest.get(this.rest.routes.FETCH_PUBLIC_GAMES, {
            ...this.options,
            baseURL: this.rest.options.gateway
        });

        return data;
    }
}