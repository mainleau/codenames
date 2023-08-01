import { Collection } from '../../util';
import User from '../structures/User';

export default class UserManager extends Collection {
    constructor(routes, options) {
        super();

        Object.defineProperties(this, 'routes', { value: routes });
        Object.defineProperties(this, 'options', { value: options });
    }

    async fetchById(id) {
        const response = await fetch(
            this.options.baseURL + this.routes.FETCH_USER_BY_ID.apply(null, [id])
        );

        return new User(response);
    }

}