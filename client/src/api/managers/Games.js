import { Collection } from '../../utils';

export default class Games extends Collection {
    constructor(routes, options) {
        super();

        Object.defineProperty(this, 'routes', { value: routes });
        Object.defineProperty(this, 'options', { value: options });
    }

    get token() {
        return localStorage.token;
    }

    async fetch() {
        const response = await fetch(
            this.options.baseURL + this.routes.FETCH_GAMES, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );

        return await response.json();
    }

}