import APIRequest from './APIRequest.js';
import AuthController from '../api/auth/index.js';
import CoreController from '../api/core/index.js';
import GameController from '../api/games/index.js';
import { isUUID, jwt } from '../utils/index.js';

export default class REST {
    constructor(token, routes, app) {
        this.token = token;
        const content = token ? jwt.verify(token) : {};
        this._guest = content.guest === true;
        
        this.routes = routes;
        
        this.auth = new AuthController(this);
        this.core = new CoreController(this);
        this.games = new GameController(this, app);

        if(!this.token) this.auth.post(routes.REQUEST).then(({ token }) => this.setToken(token));
    }

    get isGuest() {
        return this._guest;
    }

    setToken(token) {
        this.token = token;
        localStorage.token = token;
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
        }
        throw new Error('INVALID_RESPONSE');
    }
}
