import { validate as isUUID } from 'uuid';

export default class UserStorage {
    constructor(client) {
        this.client = client;

        this.options = {
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            usernameRegex: /^[a-zA-Z0-9_]+$/
        }
    }

    async increment(id, data) {
        if(!isUUID(id)) throw new Error('INVALID_ID');

        const sql = `UPDATE users SET ${Object.keys(data).map((key, index) => {
            return `${key} = ${key} + $${index + 1}`;
        }).join(', ')} WHERE id = $${Object.keys(data).length + 1}`;
     
        const response = await this.client.query(sql, [...Object.values(data), id]);
        if(!response.length) throw new Error('USER_NOT_FOUND');

        return response[0];
    }

    async create({ email, username, referrer }) {
        if(
            typeof email !== 'string' || email.length < 6 || email.length > 320
            || !this.options.emailRegex.test(email)
        ) {
            throw new Error('INVALID_EMAIL');
        }
        if(
            typeof username !== 'string' || username.length < 1 || username.length > 16
            || !this.options.usernameRegex.test(username)
        ) {
            throw new Error('INVALID_USERNAME');
        }
        if(referrer && !isUUID(referrer)) {
            throw new Error('INVALID_REFERRER');
        }

        const sql = `INSERT INTO users (email, username, referrer)
        VALUES ($1, $2, $3) RETURNING id`;

        const response = await this.client.query(sql, [email, username, null]);

        return response[0];
    }

    async fetchByEmail(email) {
        if(
            typeof email !== 'string' || email.length < 6 || email.length > 320
            || !this.options.emailRegex.test(email)
        ) {
            throw new Error('INVALID_EMAIL');
        }

        const sql = `SELECT id FROM users WHERE email = $1`;

        const response = await this.client.query(sql, [email]);
        if(!response.length) throw new Error('NO_USER_FOUND');

        return response[0];
    }

    async fetchById(id) {
        if(!isUUID(id)) throw new Error('INVALID_ID');

        const sql = 'SELECT id, username, flags, xp, gold, gems FROM users WHERE id = $1';

        const response = await this.client.query(sql, [id]);
        if(!response.length) throw new Error('USER_NOT_FOUND');

        return response[0];
    }

    async fetch(options = {
        count: 10
    }) {
        var sql = 'SELECT id, username, flags, xp, gold, gems FROM users';
        const params = [];

        if(options.count) {
            sql += ' LIMIT $1';
            params.push(options.count);
        }

        const response = await this.client.query(sql, params);
        if(!response.length) throw new Error('NO_USER_FOUND');
        
        return response;
    }
}