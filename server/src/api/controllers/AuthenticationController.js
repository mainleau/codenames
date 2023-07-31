import jwt from 'jsonwebtoken';

export default class AuthenticationController {
    constructor(client, options = {
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        usernameRegex: /^a-zA-Z0-9_$/
    }) {
        this.client = client;

        this.options = options;
    }

    async login(req, res, next) {
        const username = req.body.username;
        const password = req.body.password;

        if(!username || typeof username !== 'string') {
            return next(new Error('INVALID_USERNAME'));
        }
        if(!password || typeof password !== 'string') {
            return next(new Error('INVALID_PASSWORD'));
        }

        var id;
        try {
            var { id } = await this.client.login(username, password);
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
        const username = req.body.username;
        const password = req.body.password;

        if(
            !email || typeof email !== 'string' || email.length < 5 || email.length > 320
            || !this.options.emailRegex.test(email)
        ) {
            return next(new Error('INVALID_EMAIL'));
        }
        if(
            !username || typeof username !== 'string' || username.length > 16
            || !username.test(this.usernameRegex)
        ) {
            return next(new Error('INVALID_USERNAME'));
        }
        if(!password || typeof password !== 'string' || password.length > 256) {
            return next(new Error('INVALID_PASSWORD'));
        }

        var id;
        try {
            var { id } = await this.client.register(email, username, password);
        } catch (error) {
            return next(error);
        }

        const token = jwt.sign({
            id
        }, process.env.JWT_SECRET, { expiresIn: 30 * 24 * 60 * 60 });

        return res.send({ token });
    }
}