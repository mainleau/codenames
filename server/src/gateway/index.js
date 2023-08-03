import dotenv from 'dotenv';
dotenv.config();
import https from 'https';
import http from 'http';
import * as io from 'socket.io';
import fs from 'fs';
import Client from '../database/Client.js';
import Manager from './structures/Manager.js';

const HTTPServer = process.env.NODE_ENV === 'production'
	? https.createServer({
		cert: fs.readFileSync(process.env.CERT_PATH),
		key: fs.readFileSync(process.env.KEY_PATH)
	})
	: http.createServer();

const websocketServer = new io.Server(HTTPServer, {
	cors: {
		origin: '*'
	}
});

const client = new Client();
client.query('DELETE FROM games');

new Manager(websocketServer, client);

HTTPServer.listen(process.env.GATEWAY_PORT, () => console.log('Gateway HTTP server started.'));