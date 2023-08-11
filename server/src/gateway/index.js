import dotenv from 'dotenv';
dotenv.config();
import https from 'https';
import http from 'http';
import express from 'express';
import cors from 'cors';
import * as io from 'socket.io';
import fs from 'fs';
import Client from '../database/Client.js';
import Manager from './structures/Manager.js';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());
app.use(cors());

const HTTPServer = process.env.NODE_ENV === 'production'
	? https.createServer({
		cert: fs.readFileSync(process.env.CERT_PATH),
		key: fs.readFileSync(process.env.KEY_PATH)
	}, app)
	: http.createServer(app);

const websocketServer = new io.Server(HTTPServer, {
	cors: {
		origin: '*'
	}
});

const client = new Client();

const manager = new Manager(websocketServer, client);

import routes from './routes/index.js';

app.use((req, _, next) => {
    const token =
		req.headers.authorization ? req.headers.authorization.replace('Bearer ', '')
		: null;

	jwt.verify(token, process.env.JWT_SECRET, (error, content) => {          
		if(error) return next(new Error('INVALID_TOKEN'));    
		
		req.id = content.id;
		next();
	});
});

app.use(routes(manager));

app.use((error, _, res, next) => {
    if(!error instanceof Error) next();
    res.status(400).send({
        message: error.message
    });
});

HTTPServer.listen(process.env.GATEWAY_PORT, () => console.log('Gateway HTTP server started.'));