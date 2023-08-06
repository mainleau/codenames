import { Collection } from '../../utils';

export default class Friends extends Collection {
    constructor(rest, options) {
        super();

        Object.defineProperty(this, 'rest', { value: rest });
        Object.defineProperty(this, 'options', { value: options });
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