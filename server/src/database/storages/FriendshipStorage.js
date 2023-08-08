import { validate as isUUID } from 'uuid';

export default class FriendshipStorage {
    constructor(client) {
        this.client = client;
    }

    async create({ sender, receiver, status }) {
        if(!isUUID(sender)) {
            throw new Error('INVALID_SENDER_ID');
        }
        if(!isUUID(receiver)) {
            throw new Error('INVALID_RECEIVER_ID');
        }
        if(status && ![0, 1].includes(status)) {
            throw new Error('INVALID_FRIENDSHIP_STATUS');
        }

        const sql = `INSERT INTO friendships (sender, receiver, status) VALUES ($1, $2, $3)
        RETURNING sender, receiver, status`;

        return await this.client.query(sql, [sender, receiver, status]);
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

        const sql = `SELECT id, username, flags, level, online_at FROM users WHERE id IN (
            SELECT
                CASE
                    receiver WHEN $1 THEN sender
                    ELSE receiver
                END
            FROM friendships WHERE sender = $1 OR receiver = $1) ORDER BY online_at DESC`;

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