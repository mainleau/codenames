export default class UserController {
    constructor(client) {
        this.client = client;
    }

    async fetchById(req, res, next) {
        const id = req.id || req.params.id;

        var user;
        try {
            var user = await this.client.users.fetchById(id);
        } catch (error) {
            return next(error);
        }

        return res.send(user);
    }

    async putOnline(req, res, next) {
        const id = req.id;

        var online_at;
        try {
            var { online_at } = await this.client.users.update(id, {
                online_at: new Date()
            });
        } catch (error) {
            return next(error);
        }

        return res.send({ online_at });
    }
}