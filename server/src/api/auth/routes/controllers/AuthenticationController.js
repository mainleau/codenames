import dotenv from 'dotenv';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import jwt from 'jsonwebtoken';
import { validate as isUUID, v4 } from 'uuid';

dotenv.config();

export default class AuthenticationController {
    constructor(auth, client) {
        this.auth = auth;
        this.client = client;
    }

    async requestTokenAsGuest(_, res, __) {

        const id = uuid.v4();

        const token = jwt.sign(
            {
                id,
                guest: true,
            },
            process.env.JWT_SECRET,
            { expiresIn: 30 * 24 * 60 * 60 },
        );

        return res.send({ token });
    }

    async login(req, res, next) {
        const { email } = req.body;
        const { password } = req.body;

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

        const token = jwt.sign(
            {
                id,
                guest: false,
            },
            process.env.JWT_SECRET,
            { expiresIn: 30 * 24 * 60 * 60 },
        );

        return res.send({ token });
    }

    async register(req, res, next) {
        const { email } = req.body;
        const { password } = req.body;
        const { username } = req.body;
        const { referrer } = req.body;

        var id;
        try {
            var { id } = await this.client.users.create({ email, username, referrer });
            await this.client.users.createStats(id);
            if (isUUID(referrer)) {
                this.client.friendships.create({
                    sender: referrer,
                    receiver: id,
                    status: 1,
                });
            }
        } catch (error) {
            return next(error);
        }

        var user;
        try {
            user = await createUserWithEmailAndPassword(this.auth, email, password);
        } catch (error) {
            return next(error);
        }

        const token = jwt.sign(
            {
                id,
                guest: false,
            },
            process.env.JWT_SECRET,
            { expiresIn: 30 * 24 * 60 * 60 },
        );

        return res.send({ token });
    }
}
