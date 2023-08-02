export default class Authenticator {
    constructor(routes, options) {
        Object.defineProperty(this, 'routes', { value: routes });
        Object.defineProperty(this, 'options', { value: options });
        console.log(this.routes, this.options)
    }

    async login({ email, password }) {
        console.log(this.options.baseURL + this.routes.LOGIN);
        const response = await fetch(this.options.baseURL + this.routes.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        return await response.json();
    }

    async register({ email, password }, { username, referrer }) {
        const response = await fetch(this.options.baseURL + this.routes.REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, username, referrer })
        });

        return await response.json();
    }
}