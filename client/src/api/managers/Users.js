import { Collection } from '../../utils';
import User from '../structures/User';

export default class Users extends Collection {
    constructor(routes, options) {
        super();

        Object.defineProperty(this, 'routes', { value: routes });
        Object.defineProperty(this, 'options', { value: options });
    }

    get token() {
        return localStorage.token;
    }

    async fetchMe() {
        const response = await fetch(
            this.options.baseURL + this.routes.FETCH_ME, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );

        return new User(await response.json());
    }

    async fetchById(id) {
        const response = await fetch(
            this.options.baseURL + this.routes.FETCH_USER_BY_ID.apply(null, [id]), {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );

        return new User(await response.json());
    }

}