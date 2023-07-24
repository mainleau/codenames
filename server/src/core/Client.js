import Database from './Database.js';

export default class Client extends Database {

    async fetchWords() {
        const request = 'SELECT * FROM words ORDER BY RANDOM() LIMIT 25';
        const response = await this.query(request);

        return response.map(word => word.name);
    }

    async login(username, password) {
        const request = "SELECT * FROM players WHERE username = $1 AND password = HASHBYTES('SHA2_256', $2)";
        const response = await this.query(request, [username, password]);

        return response;
    }
}