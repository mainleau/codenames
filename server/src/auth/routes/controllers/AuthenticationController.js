import dotenv from 'dotenv';
dotenv.config();
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import jwt from 'jsonwebtoken';

export default class AuthenticationController {
    constructor(auth, client) {
        this.auth = auth;
        this.client = client;
    }

    async login(req, res, next) {
        const email = req.body.email;
        const password = req.body.password;

        var user;
        try {
            user = await signInWithEmailAndPassword(this.auth, email, password);
        } catch (error) {
            return next(error);
        }

        var id;
        try {
            var { id } = await this.client.users.fetchByEmail(email);
        } catch (error) {
            return next(error);
        }

        const token = jwt.sign({
            id
        }, process.env.JWT_SECRET, { expiresIn: 30 * 24 * 60 * 60 });

        return res.send({ token });
    }

    async register(req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const referrer = req.body.referrer;

        var id;
        try {
            var { id } = await this.client.users.create({ email, username, referrer });
        } catch (error) {
            return next(error);
        }

        var user;
        try {
            user = await createUserWithEmailAndPassword(this.auth, email, password);
        } catch (error) {
            return next(error);
        }

        const token = jwt.sign({
            id
        }, process.env.JWT_SECRET, { expiresIn: 30 * 24 * 60 * 60 });

        return res.send({ token });
    }
}