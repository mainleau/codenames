import express from 'express';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Client from '../../database/Client.js';
import AuthenticationController from './controllers/AuthenticationController.js';

const router = express.Router();

const app = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY
});
const auth = getAuth(app);

const client = new Client();

const authentication = new AuthenticationController(auth, client);
router.post('/register', authentication.register.bind(authentication));
router.post('/login', authentication.login.bind(authentication));

export default router;