import express from 'express';
import st from 'stripe';
import Client from '../../database/Client.js';
import FriendshipController from '../controllers/FriendshipController.js';
import GameController from '../controllers/GameController.js';
import UserController from '../controllers/UserController.js';

const router = express.Router({
    caseSensitive: true,
});
const client = new Client();
const stripe = st(
    'sk_test_51NWcXqFxwc8JXqKOCccCl9GeVXemUHCatE7UWwEraQYvV9NuBQiA8eVem5hEVg2ooGnmPNUz8fM2nTIpi3HldWRE00QnOFHhcK',
);

router.get('/order/create', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        const username = session.custom_fields[0].text.value;
        const customer = await stripe.customers.retrieve(session.customer);

        const user = await client.query('SELECT flags FROM users WHERE username = $1', [
            username,
        ]);
        if (user[0].flags & 0x01) {
            return res.send(
                '<html><body><h1>Déjà commandé, demandez un remboursement en cas de problème.</h1></body></html>',
            );
        }

        client.query('UPDATE users SET flags = flags + $2 WHERE username = $1', [
            username,
            0x01,
        ]);
        res.send(
            `<html><body><h1>Merci pour votre commande, ${customer.name}!</h1></body></html>`,
        );
    } catch {
        res.send('<html><body><h1>Erreur lors de la commande.</h1></body></html>');
    }
});

const users = new UserController(client);
router.get('/users/:id', (req, res, next) => {
    if (typeof req.headers.authorization !== 'string') {
        return next(new Error('TOKEN_NOT_PROVIDED'));
    }
    users.fetchById(req, res, next);
});
router.get('/users/me', (req, res, next) => {
    if (typeof req.headers.authorization !== 'string') {
        return next(new Error('TOKEN_NOT_PROVIDED'));
    }
    users.fetchById(req, res, next);
});
router.post('/online', (req, res, next) => {
    if (typeof req.headers.authorization !== 'string') {
        return next(new Error('TOKEN_NOT_PROVIDED'));
    }
    users.putOnline(req, res, next);
});
router.get('/users/me/stats', (req, res, next) => {
    if (typeof req.headers.authorization !== 'string') {
        return next(new Error('TOKEN_NOT_PROVIDED'));
    }
    users.fetchStatsByUserId(req, res, next);
});
router.get('/users/:id/stats', (req, res, next) => {
    if (typeof req.headers.authorization !== 'string') {
        return next(new Error('TOKEN_NOT_PROVIDED'));
    }
    users.fetchStatsByUserId(req, res, next);
});

const friends = new FriendshipController(client);
router.get('/friends', (req, res, next) => {
    if (typeof req.headers.authorization !== 'string') {
        return next(new Error('TOKEN_NOT_PROVIDED'));
    }
    friends.fetchByUserId(req, res, next);
});
router.get('/friends/requests', (req, res, next) => {
    if (typeof req.headers.authorization !== 'string') {
        return next(new Error('TOKEN_NOT_PROVIDED'));
    }
    friends.fetchRequestsByUserId(req, res, next);
});
router.get('/friends/requests/:id', (req, res, next) => {
    if (typeof req.headers.authorization !== 'string') {
        return next(new Error('TOKEN_NOT_PROVIDED'));
    }
    friends.request(req, res, next);
});

const games = new GameController(client);
router.get('/games', (req, res, next) => {
    if (typeof req.headers.authorization !== 'string') {
        return next(new Error('TOKEN_NOT_PROVIDED'));
    }
    games.fetch(req, res, next);
});

export default router;
