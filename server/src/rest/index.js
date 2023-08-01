import dotenv from 'dotenv';
dotenv.config();
import * as https from 'https';
import * as http from 'http';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

app.use((error, _, res, next) => {
    if(!error) next();
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

HTTPServer.listen(process.env.REST_PORT, () => console.log('REST HTTP server started.'));