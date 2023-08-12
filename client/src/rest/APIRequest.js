export default class APIRequest {
  constructor(rest, method, route, options) {
    this.rest = rest;
    this.method = method;
    if (options.params) {
      route = route.apply(this, options.params);
    }
    this.route = route;
    this.options = options;
  }

  make() {
    let url = this.options.baseURL + this.route;

    if (this.options.query) {
      url += `?${new URLSearchParams(options.query).toString()}`;
    }

    const headers = {};
    let body;

    if (!this.options.noauth) {
      headers.Authorization = `Bearer ${this.rest.token}`;
    }

    if (this.options.body !== null && this.options.body !== undefined) {
      body = JSON.stringify(this.options.body);
      headers['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    return fetch(url, {
      method: this.method,
      headers,
      body,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));
  }
}
