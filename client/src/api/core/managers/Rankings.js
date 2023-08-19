import { Collection } from '../../../utils';
import User from '../structures/User';

export default class Rankings extends Collection {
    constructor(api) {
        super();

        Object.defineProperty(this, 'api', { value: api });
    }

    async fetchPoint() {
        const data = await this.api.core.get(this.api.routes.FETCH_POINT_RANKING);

        return data.map(user => new User(this.api, user));
    }
}
