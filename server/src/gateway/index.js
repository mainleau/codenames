import * as dotenv from 'dotenv';
import * as https from 'https';
import * as http from 'http';
import express from 'express';
import cors from 'cors';
import * as uuid from 'uuid';
import * as io from 'socket.io';
import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import Client from '../core/Client.js';
import Manager from './structures/Manager.js';

dotenv.config();

const client = new Client();

const gatewayHTTPServer = process.env.NODE_ENV === 'production'
	? https.createServer({
		cert: fs.readFileSync(process.env.CERT_PATH),
		key: fs.readFileSync(process.env.KEY_PATH)
	})
	: http.createServer();

const websocketServer = new io.Server(gatewayHTTPServer, {
	cors: {
		origin: '*'
	}
});

const manager = new Manager(websocketServer, client);

gatewayHTTPServer.listen(8888);


const app = express();

app.use(express.json());
app.use(cors());

const apiHTTPServer = process.env.NODE_ENV === 'production'
	? https.createServer({
		cert: fs.readFileSync(process.env.CERT_PATH),
		key: fs.readFileSync(process.env.KEY_PATH)
	}, app)
	: http.createServer(app);

app.get('/words', async (req, res) => {
    const count = req.query.count || 25;
    const words = await client.fetchWords(count);
    res.send(words);
});

app.get('/rooms', async (_, res) => {
    const games = manager.games;
    res.send(games);
});

app.post('/login', async (req, res) => {
	const data = await client.query("SELECT id FROM players WHERE username=$1 AND password=ENCODE(SHA256($2), 'hex')", [req.body.username, req.body.password]);

	if(data.length) {
		const token = jwt.sign({
			id: data[0].id
		}, process.env.JWT_SECRET, { expiresIn: 365 * 24 * 60 * 60 });
		res.send({ id: data[0].id, token });
	} else {
		res.send({ success: false })
	}
});

app.post('/register', async (req, res) => {
	const id = uuid.v4();
	const token = jwt.sign({
		id
	}, process.env.JWT_SECRET, { expiresIn: 365 * 24 * 60 * 60 });

	var result;
	var success;

	try {
		result = await client.query(`INSERT INTO players(id, username, password) VALUES($1, $2, ENCODE(SHA256($3), 'hex')) RETURNING id`, [id, req.body.username.toLowerCase(), req.body.password]);
		success = true;
	} catch (e) {
		console.log(e)
		success = false;
	}

	res.send(success ? { id: result[0].id, token } : { success });
});

apiHTTPServer.listen(8889);