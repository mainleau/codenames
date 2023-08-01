import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import Client from '../../database/Client.js';
import AuthenticationController from './controllers/AuthenticationController.js';

const router = express.Router();
const client = new Client();

const authentication = new AuthenticationController(client);
router.post('/auth/register', authentication.register.bind(authentication));
router.post('/auth/login', authentication.login.bind(authentication));

export default router;