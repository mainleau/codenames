import pg from 'pg';
import * as fs from 'fs';

const { Client } = pg;

export default class Database {
    constructor() {
        this.client = new Client();
        this.client.connect().then(() => false && this.init());
    }

    async query(string, params = []) {
        const response = await this.client.query(string, params);
        
        return response.rows;
    }

    init() {
        const sql = fs.readFileSync('./schema.sql', 'utf8');
        this.client.query(sql);
    }
}