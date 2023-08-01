export default class WordStorage {
    constructor(client) {
        this.client = client;
    }

    async fetch({ count, random = false } = {}) {
        if(count && !(Number.isInteger(count) && count > 0)) {
            throw new Error('INVALID_COUNT');
        }
        if(random && typeof random !== 'boolean') {
            throw new Error('INVALID_COUNT');
        }

        var sql = 'SELECT * FROM words';
        const params = [];

        if(random) {
            sql += ' ORDER BY RANDOM()';
        }
        if(count) {
            sql += ' LIMIT $1';
            params.push(count)
        }

        const response = await this.client.query(sql, [count]);
        if(!response.length) throw new Error('NO_WORD_FOUND');

        return response;
    }
}