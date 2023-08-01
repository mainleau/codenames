export default class UserController {
    constructor(client) {
        this.client = client;
    }

    async fetch(req, res, next) {
        const id = req.params.id;

        var user;
        try {
            var user = await this.client.users.fetchById(id);
        } catch (error) {
            return next(error);
        }

        return res.send(user);
    }
}