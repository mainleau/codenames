import fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import routes from './routes/index.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, _, next) => {
  const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

  jwt.verify(token, process.env.JWT_SECRET, (error, content) => {
    if (error) return next(new Error('INVALID_TOKEN'));

    req.id = content.id;
    next();
  });
});

app.use(routes);

app.use((error, _, res, next) => {
  if (!error instanceof Error) next();
  res.status(400).send({
    message: error.message,
  });
});

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

HTTPServer.listen(process.env.API_PORT, () => console.log('API HTTP server started.'));
