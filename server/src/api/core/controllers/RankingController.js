export default class RankingController {
    constructor(client) {
        this.client = client;
    }

    async fetchPoint(_, res, next) {
        var users;
        try {
            var users = await this.client.users.fetch({
                order: true,
                count: 25
            });
        } catch (error) {
            return next(error);
        }

        return res.send(users);
    }
}
