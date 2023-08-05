import { validate as isUUID } from 'uuid';

export default class FriendshipStorage {
    constructor(client) {
        this.client = client;
    }

    async create({ sender, receiver }) {
        if(!isUUID(sender)) {
            throw new Error('INVALID_SENDER_ID');
        }
        if(!isUUID(receiver)) {
            throw new Error('INVALID_RECEIVER_ID');
        }

        const sql = `INSERT INTO friendships (sender, receiver) VALUES ($1, $2)
        RETURNING sender, receiver, status`;

        return await this.client.query(sql, [sender, receiver]);
    }

    async update({ sender, receiver, status }) {
        if(!isUUID(sender)) {
            throw new Error('INVALID_SENDER_ID');
        }
        if(!isUUID(receiver)) {
            throw new Error('INVALID_RECEIVER_ID');
        }

        const sql = `UPDATE friendships SET status = $3
        WHERE sender = $1 AND receiver = $2 RETURNING sender, receiver, status`;

        return await this.client.query(sql, [sender, receiver, status]);
    }

    async fetchRequestsByUserId(id) {
        if(!isUUID(id)) throw new Error('INVALID_ID');

        const sql = `SELECT sender, receiver, status FROM friendships
        WHERE sender = $1 OR receiver = $1`;

        const response = await this.client.query(sql, [id]);
        if(!response.length) throw new Error('FRIENDSHIP_NOT_FOUND');

        return response;
    }

    async fetchByUserId(id) {
        if(!isUUID(id)) throw new Error('INVALID_ID');

        const sql = `SELECT id, username, level FROM users WHERE id IN (
            SELECT
                CASE
                    receiver WHEN $1 THEN sender
                    ELSE receiver
                END
            FROM friendships WHERE sender = $1 OR receiver = $1)`;

        const response = await this.client.query(sql, [id]);

        return response;
    }

    async fetch(options = { count }) {
        var sql = 'SELECT sender, receiver, status FROM friendships';
        const params = [];

        if(options.count) {
            sql += ' LIMIT $1';
            params.push(options.count);
        }

        const response = await this.client.query(sql, params);
        
        return response;
    }
}