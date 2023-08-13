export default class Authenticator {
    constructor(rest) {
        this.rest = rest;
        this.options = {
            baseURL: this.rest.options.api.auth,
        };
    }

    async login({ email, password }) {
        const data = await this.rest.post(this.rest.routes.LOGIN, {
            ...this.options,
            body: {
                email,
                password,
            },
        });

        return data;
    }

    async register({ email, password }, { username, referrer }) {
        const data = this.rest.post(this.rest.routes.REGISTER, {
            ...this.options,
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
