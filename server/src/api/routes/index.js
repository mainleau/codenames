import express from 'express';
import Client from '../../database/Client.js';
import UserController from '../controllers/UserController.js';
import GameController from '../controllers/GameController.js';

const router = express.Router();
const client = new Client();

import st from 'stripe';
const stripe = st('sk_test_51NWcXqFxwc8JXqKOCccCl9GeVXemUHCatE7UWwEraQYvV9NuBQiA8eVem5hEVg2ooGnmPNUz8fM2nTIpi3HldWRE00QnOFHhcK');

router.get('/order/create', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
	const username = session.custom_fields[0].text.value;
    const customer = await stripe.customers.retrieve(session.customer);

	client.query('UPDATE users SET flags = flags + $2 WHERE username = $1', [username, 0x01]);

    res.send(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);
});

const users = new UserController(client);
router.get('/users/:id', users.fetchById.bind(users));
router.get('/users/me', users.fetchById.bind(users));

const games = new GameController(client);
router.get('/games', games.fetch.bind(games));

export default router;