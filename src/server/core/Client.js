import Database from './Database.js';

export default class Client extends Database {

    async fetchWords() {
        const request = 'SELECT * FROM words ORDER BY RANDOM() LIMIT 25';
        const response = await this.query(request);

        return response.map(word => word.name);
    }
}