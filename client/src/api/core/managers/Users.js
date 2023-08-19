import { Collection } from '../../../utils';
import User from '../structures/User';

export default class Users extends Collection {
    constructor(api) {
        super();

        Object.defineProperty(this, 'api', { value: api });
    }

    async fetchMe() {
        const data = await this.api.core.get(this.api.routes.FETCH_ME);

        return new User(this.api, data);
    }

    async fetchById(id) {
        const data = await this.api.core.get(this.api.routes.FETCH_USER_BY_ID, {
            params: [id],
        });

        return new User(this.api, data);
    }

    async fetchStatsByUserId(id) {
        const data = await this.api.core.get(this.api.routes.FETCH_STATS_BY_USER_ID, {
            params: [id],
        });

        return data;
    }

    async fetchOwnStats() {
        const data = await this.api.core.get(this.api.routes.FETCH_OWN_STATS);

        return data;
    }

    putMeOnline() {
        this.api.core.post(this.api.routes.PUT_ME_ONLINE);
    }
}
