import { validate as isUUID } from 'uuid';

export default class UserManager {
    constructor(client) {
        this.client = client;

        this.options = {
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            usernameRegex: /^a-zA-Z0-9_$/
        }
    }

    async create({ email, username, password }) {
        if(
            !email || typeof email !== 'string' || email.length < 5 || email.length > 320
            || !this.options.emailRegex.test(email)
        ) {
            return next(new Error('INVALID_EMAIL'));
        }
        if(
            !username || typeof username !== 'string' || username.length > 16
            || !username.test(this.usernameRegex)
        ) {
            return next(new Error('INVALID_USERNAME'));
        }
        if(!password || typeof password !== 'string' || password.length > 256) {
            return next(new Error('INVALID_PASSWORD'));
        }

        const sql = `INSERT INTO users (email, username, password)
        VALUES ($1, $2, ENCODE(SHA256($3), 'hex')) RETURNING id`;

        const response = await this.client.query(sql, [email, username, password]);

        return response;
    }

    async validate({ username, password }) {
        if(!username || typeof username !== 'string') {
            return next(new Error('INVALID_USERNAME'));
        }
        if(!password || typeof password !== 'string') {
            return next(new Error('INVALID_PASSWORD'));
        }

        const sql = `SELECT id FROM users WHERE username = $1 AND password = ENCODE(SHA256($2), 'hex')`;

        const response = await this.client.query(sql, [username, password]);

        return response;
    }

    async fetchById(id) {
        if(!isUUID(id)) throw new Error('INVALID_ID');

        const sql = 'SELECT id, username, gold FROM players WHERE id = $1';

        const response = await this.client.query(sql, [id]);
        if(!response.length) throw new Error('PLAYER_NOT_FOUND');

        return response[0];
    }

    async fetch(options = {
        count: 10
    }) {
        var sql = 'SELECT id, username, gold FROM players';
        const params = [];

        if(options.count) {
            sql += ' LIMIT $1';
            params.push(options.count);
        }

        const response = await this.client.query(sql, params);
        if(!response.length) throw new Error('NO_PLAYER_FOUND');
        
        return response;
    }
}