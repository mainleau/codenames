export default class BaseController {
    constructor(api) {
        Object.defineProperty(this, 'api', { value: api });
    }

    get(route, options) {
        return this.api.get(route, {
            ...this.options,
            ...options
        });
    }

    post(route, options) {
        return this.api.post(route, {
            ...this.options,
            ...options
        });
    }
}