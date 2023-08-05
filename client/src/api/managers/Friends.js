import { Collection } from '../../utils';

export default class Friends extends Collection {
    constructor(routes, options) {
        super();

        Object.defineProperty(this, 'routes', { value: routes });
        Object.defineProperty(this, 'options', { value: options });
    }

    get token() {
        return localStorage.token;
    }

    async sendRequest(id) {
        const response = await fetch(
            this.options.baseURL + this.routes.SEND_FRIEND_REQUEST(id), {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );

        return await response.json();
    }

    async fetch() {
        const response = await fetch(
            this.options.baseURL + this.routes.FETCH_FRIENDS, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );

        return await response.json();
    }

    async fetchRequests() {
        const response = await fetch(
            this.options.baseURL + this.routes.FETCH_FRIEND_REQUESTS, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        );

        return await response.json();
    }

}