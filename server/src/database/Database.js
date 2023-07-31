import pg from 'pg';
import fs from 'fs/promises';

export default class Database {
    constructor() {
        this.client = new pg.Pool();

        if(['--init', '-i'].includes(process.argv[2])) this.init();
    }

    query(sql, params = []) {
        return this.client.query(sql, params)
            .then(response => response.rows)
            .catch(() => console.log('Failed to execute query.'));
    }

    init() {
        fs.readFile('./schema.sql', { encoding: 'utf-8' })
            .then(sql => this.query(sql))
            .then(() => console.log('Database initialized.'))
            .catch(() => {
                console.log('Failed to initialize database.');
            });
    }
}