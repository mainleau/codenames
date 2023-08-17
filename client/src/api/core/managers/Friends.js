import { Collection } from '../../../utils';

export default class Friends extends Collection {
    constructor(api) {
        super();

        Object.defineProperty(this, 'api', { value: api });
    }

    async fetchWithGames() {
        const data = await this.api.games.get(this.api.routes.FETCH_FRIEND_GAMES);

        return data;
    }

    async fetch() {
        const data = this.api.core.get(this.api.routes.FETCH_FRIENDS);

        return data;
    }

    async fetchRequests() {
        const data = this.api.core.get(this.api.routes.FETCH_FRIEND_REQUESTS);

        return data;
    }

    async sendRequest(id) {
        const data = await this.api.post(this.api.routes.SEND_FRIEND_REQUEST, {
            ...this.options,
            params: [id],
        });

        return data;
    }
}
