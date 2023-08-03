import { validate as isUUID } from 'uuid';

export default class GameStorage {
    constructor(client) {
        this.client = client;
    }

    create(id, { playerCountByTeam }) {
        if(!isUUID(id)) throw new Error('INVALID_ID'); 
        if(
            !Array.isArray(playerCountByTeam)
            || !playerCountByTeam.some(count => Number.isInteger(count) && count >= 0)
        ) {
            throw new Error('INVALID_PLAYER_COUNT_BY_TEAM'); 
        }

        const sql = 'INSERT INTO games (id, player_count_by_team) VALUES ($1, $2)';

        this.client.query(sql, [id, playerCountByTeam]);
    }

    update(id, { playerCountByTeam }) {
        if(!isUUID(id)) throw new Error('INVALID_ID');
        if(
            !Array.isArray(playerCountByTeam)
            || !playerCountByTeam.some(count => Number.isInteger(count) && count >= 0)
        ) {
            throw new Error('INVALID_PLAYER_COUNT_BY_TEAM'); 
        }

        const sql = 'UPDATE games SET player_count_by_team = $2 WHERE id = $1';

        this.client.query(sql, [id, playerCountByTeam]);
    }

    remove(id) {
        if(!isUUID(id)) throw new Error('INVALID_ID'); 

        const sql = 'DELETE FROM games WHERE id = $1';

        this.client.query(sql, [id]);
    }

    async fetch({ count } = {}) {
        if(count && !(Number.isInteger(count) && count >= 0)) {
            throw new Error('INVALID_COUNT');
        }

        var sql = 'SELECT * FROM games';
        const params = [];

        if(count) {
            sql += ' LIMIT $1';
            params.push(count)
        }

        const response = await this.client.query(sql, params);

        return response;
    }
}