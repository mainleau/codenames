import * as dotenv from 'dotenv';
import pg from 'pg';
import * as fs from 'fs';

dotenv.config();
const { Client } = pg;

export default class Database {
    constructor() {
        this.client = new Client();
        this.client.connect().then(() => this.init());
    }

    async query(...params) {
        const response = await this.client.query(...params);

        return response.rows;
    }

    init() {
        const sql = fs.readFileSync('./schema.sql', 'utf8');
        this.client.query(sql);
    }
}