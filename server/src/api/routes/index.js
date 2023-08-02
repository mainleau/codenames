import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import Client from '../../database/Client.js';
import UserController from '../controllers/UserController.js';
import GameController from '../controllers/GameController.js';

const router = express.Router();
const client = new Client();

const users = new UserController(client);
router.get('/users/:id', users.fetchById.bind(users));
router.get('/users/me', users.fetchById.bind(users));

const games = new GameController(client);
router.get('/games', games.fetch.bind(games));

export default router;