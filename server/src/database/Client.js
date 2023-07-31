import Database from './Database.js';

export default class Client extends Database {

    async fetchWords(count = 25) {
        const sql = 'SELECT * FROM words ORDER BY RANDOM() LIMIT $1';
        const response = await this.query(sql, [count]);

        return response;
    }

    addGame({ id, playerCountByTeam }) {
        const sql = 'INSERT INTO games (id, player_count_by_team) VALUES ($1, $2)';
        this.query(sql, [id, playerCountByTeam]);
    }

    updateGame({ id, playerCountByTeam }) {
        const sql = 'UPDATE games SET player_count_by_team = $2 WHERE id = $1';
        this.query(sql, [id, playerCountByTeam]);
    }

    removeGame(id) {
        const sql = 'DELETE FROM games WHERE id = $1';
        this.query(sql, [id]);
    }

    async fetchGames(count = 3) {
        const sql = 'SELECT id, player_count_by_team FROM games LIMIT $1';
        const response = await this.query(sql, [count]);

        return response;
    }

    async login(username, password) {
        const sql = "SELECT id FROM players WHERE username = $1 AND password = ENCODE(SHA256($2), 'hex')";
        const response = await this.query(sql, [username, password]);

        if(!response.length) throw new Error('INVALID_CREDENTIALS');

        return response[0];
    }

    async register(email, username, password) {
        const sql = `INSERT INTO players (email, username, password)
        VALUES ($1, $2, ENCODE(SHA2_256($3), 'hex')) RETURNING id`;
        const response = await this.query(sql, [email.toLowerCase(), username, password]);

        if(!response.length) throw new Error('PLAYER_ALREADY_EXISTS');

        return response[0];
    }

    async fetchPlayer(id) {
        const sql = 'SELECT id, username, gold FROM players WHERE id = $1';
        const response = await this.query(sql, [id]);

        if(!response.length) throw new Error('PLAYER_NOT_FOUND');

        return response[0];
    }
}