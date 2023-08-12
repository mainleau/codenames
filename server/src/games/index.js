import fs from 'fs';
import http from 'http';
import https from 'https';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import * as io from 'socket.io';
import routes from './routes/index.js';
import Manager from './structures/Manager.js';
import Client from '../database/Client.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const HTTPServer =
    process.env.NODE_ENV === 'production'
        ? https.createServer(
              {
                  cert: fs.readFileSync(process.env.CERT_PATH),
                  key: fs.readFileSync(process.env.KEY_PATH),
              },
              app,
          )
        : http.createServer(app);

const websocketServer = new io.Server(HTTPServer, {
    cors: {
        origin: '*',
    },
});

const client = new Client();

const manager = new Manager(websocketServer, client);

app.use((req, _, next) => {
    const token = req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null;

    jwt.verify(token, process.env.JWT_SECRET, (error, content) => {
        if (error) return next(new Error('INVALID_TOKEN'));

        req.id = content.id;
        next();
    });
});

app.use(routes(manager));

app.use((error, _, res, next) => {
    if (!error instanceof Error) next();
    res.status(400).send({
        message: error.message,
    });
});

HTTPServer.listen(process.env.GATEWAY_PORT, () =>
    console.log('Gateway HTTP server started.'),
);
