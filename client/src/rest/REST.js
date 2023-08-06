import APIRequest from './APIRequest.js';

export default class REST {
    constructor(token, routes, options) {
        this.routes = routes;
        this.options = options;
        this.token = token;
    }

    get(route, options = {}) {
        return this.#request('GET', route, options);
    }

    post(route, options = {}) {
        return this.#request('POST', route, options);
    }

    async #request(method, route, options) {
        const request = new APIRequest(this, method, route, options);
    
        const response = await request.make();

        switch (response.status) {
            case 401:
                throw new Error('INVALID_TOKEN');
            case 429:
                throw new Error('TOO_MANY_REQUESTS');
            default:
                if (response.status !== 200) throw new Error('ERROR_OCCURED');
        }
    
        if (response.headers.get('Content-Type')?.startsWith('application/json')) {
            return response.json();
        } else {
            throw new Error('INVALID_RESPONSE');
        }
    }

}