import fs from 'fs/promises';
import pg from 'pg';

export default class Database {
    constructor() {
        this.pool = new pg.Pool();

        if (['--init', '-i'].includes(process.argv[2])) this.init();
    }

    query(sql, params = []) {
        return this.pool
            .query(sql, params)
            .then(response => response.rows)
            .catch(e => console.log(e, 'Failed to execute query.'));
    }

    init() {
        fs.readFile('./schema.sql', { encoding: 'utf-8' })
            .then(sql => this.pool.query(sql))
            .then(() => console.log('Database initialized.'))
            .catch(e => {
                console.log(e, 'Failed to initialize database.');
            });
    }
}
