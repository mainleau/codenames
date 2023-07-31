import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import Client from '../../database/Client.js';
import AuthenticationController from '../controllers/AuthenticationController.js';
import PlayerController from '../controllers/PlayerController.js';
import GameController from '../controllers/GameController.js';

const router = express.Router();
const client = new Client();

const authentication = new AuthenticationController(client);
router.post('/auth/register', authentication.register.bind(authentication));
router.post('/auth/login', authentication.login.bind(authentication));

const players = new PlayerController(client);
router.get('/players/:id', players.fetch.bind(players));

const games = new GameController(client);
router.get('/games', games.fetch.bind(games));

export default router;