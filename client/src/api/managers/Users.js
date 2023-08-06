import { Collection } from '../../utils';
import User from '../structures/User';

export default class Users extends Collection {
    constructor(rest, options) {
        super();

        Object.defineProperty(this, 'rest', { value: rest });
        Object.defineProperty(this, 'options', { value: options });
    }

    async fetchMe() {
        const data = await this.rest.get(this.rest.routes.FETCH_ME, this.options);

        return new User(data);
    }

    async fetchById(id) {
        const data = await this.rest.get(this.rest.routes.FETCH_USER_BY_ID, {
            ...this.options,
            params: [id]
        })

        return new User(data);
    }
}