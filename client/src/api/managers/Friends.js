import { Collection } from '../../utils';

export default class Friends extends Collection {
    constructor(rest, client, options) {
        super();

        Object.defineProperty(this, 'rest', { value: rest });
        Object.defineProperty(this, 'client', { value: client });
        Object.defineProperty(this, 'options', { value: options });
    }

    async fetchWithGames() {
        const data = await this.rest.get(this.rest.routes.FETCH_FRIEND_GAMES, {
            ...this.options,
            baseURL: this.rest.options.gateway
        });

        return data;
    }

    async fetch() {
        const data = this.rest.get(this.rest.routes.FETCH_FRIENDS, this.options);

        return data;
    }

    async fetchRequests() {
        const data = this.rest.get(this.rest.routes.FETCH_FRIEND_REQUESTS, this.options);

        return data;
    }

    async sendRequest(id) {
        const data = await this.rest.post(this.rest.routes.SEND_FRIEND_REQUEST, {
            ...this.options,
            params: [id]
        });

        return data;
    }
}