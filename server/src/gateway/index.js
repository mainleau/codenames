import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import * as io from 'socket.io';
import fs from 'fs';
import Client from '../database/Client.js';
import Manager from './structures/Manager.js';

dotenv.config();

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

new Manager(websocketServer, client);

HTTPServer.listen(8888);