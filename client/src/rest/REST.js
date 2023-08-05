export default class REST {
    constructor() {
        this.options = {
            api: 'https://api.nomdecode.fun',
            auth: 'https://auth.nomdecode.fun',
            cdn: 'https://cdn.nomdecode.fun'
        };
    }

  get(route, options = {}) {
    return this.#make('GET', route, options);
  }

  post(route, options = {}) {
    return this.#make('POST', route, options);
  }

  #make(method, route, options) {
    var url = options.baseURL + route;

    if(options.query) {
        url += `?${new URLSearchParams(options.query).toString()}`;
    }

    const headers = {};
    let body;

    if(options.auth) {
        headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.options.data !== null && this.options.data !== undefined) {
      body = JSON.stringify(this.options.data);
      headers['Content-Type'] = 'application/json';
    }

    return {
      url,
      method,
      headers,
      body
    }
  }
}