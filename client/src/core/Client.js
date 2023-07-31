export default class Client {

    get baseURL() {
        return location.hostname === 'localhost'
            ? 'http://localhost:8889'
            : `https://${location.hostname}:8889`;
    }

    fetchRooms() {
        const route = '/games';

        return fetch(this.baseURL + route)
            .then(res => res.json());
    }

    async login(username, password) {
        const route = '/auth/login';

        const response = await fetch(this.baseURL + route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        return await response.json();
    }

    async fetchPlayer(id) {
        const route = `/players/${id}`;

        const response = await fetch(this.baseURL + route, {
            method: 'GET'
        });

        return await response.json();
    }
}