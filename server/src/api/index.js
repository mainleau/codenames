import dotenv from 'dotenv';
dotenv.config();
import * as https from 'https';
import * as http from 'http';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import routes from './routes/index.js';
import fs from 'fs';

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
	if(typeof req.headers.authorization !== 'string') {
		return next(new Error('TOKEN_NOT_PROVIDED'));
	}
    const token = req.headers.authorization.replace('Bearer ', '');

	jwt.verify(token, process.env.JWT_SECRET, (error, content) => {          
		if(error) return next(new Error('INVALID_TOKEN'));    
		
		req.id = content.id;
		next();
	});
});

app.use(routes);

app.use((error, _, res, next) => {
    if(!error instanceof Error) next();
    res.status(400).send({
        message: error.message
    });
});

const HTTPServer = process.env.NODE_ENV === 'production'
	? https.createServer({
		cert: fs.readFileSync(process.env.CERT_PATH),
		key: fs.readFileSync(process.env.KEY_PATH)
	}, app)
	: http.createServer(app);

HTTPServer.listen(process.env.API_PORT, () => console.log('API HTTP server started.'));