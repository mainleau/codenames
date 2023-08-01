import jwt from 'jsonwebtoken';

export default class AuthenticationController {
    constructor(client) {
        this.client = client;
    }

    async login(req, res, next) {
        const username = req.body.username;
        const password = req.body.password;

        var id;
        try {
            var { id } = await this.client.users.validate({ username, password });
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

        var id;
        try {
            var { id } = await this.client.users.create({ email, username, password });
        } catch (error) {
            return next(error);
        }

        const token = jwt.sign({
            id
        }, process.env.JWT_SECRET, { expiresIn: 30 * 24 * 60 * 60 });

        return res.send({ token });
    }
}