import BaseController from '../BaseController.js';

export default class AuthController extends BaseController {
    constructor(api) {
        super(api);

        this.options = {
            baseURL: location.hostname !== 'localhost'
                ? 'https://api-auth.nomdecode.fun'
                : 'http://localhost:8889'
        }
    }

    async request() {
        const data = await this.api.auth.post(this.api.routes.REQUEST);

        return data;
    }

    async login({ email, password }) {
        const data = await this.api.auth.post(this.api.routes.LOGIN, {
            body: {
                email,
                password,
            },
        });

        return data;
    }

    async register({ email, password }, { username, referrer }) {
        const data = this.api.auth.post(this.api.routes.REGISTER, {
            body: {
                email,
                password,
                username,
                referrer,
            },
        });

        return data;
    }
}
