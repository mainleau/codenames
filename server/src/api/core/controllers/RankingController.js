export default class RankingController {
    constructor(client) {
        this.client = client;
    }

    async fetchXP(_, res, next) {
        var users;
        try {
            var users = await this.client.users.fetch({
                order: 'xp',
                count: 25
            });
        } catch (error) {
            return next(error);
        }

        return res.send(users);
    }

    async fetchPoint(_, res, next) {
        var users;
        try {
            var users = await this.client.users.fetch({
                order: 'points',
                count: 25
            });
        } catch (error) {
            return next(error);
        }

        return res.send(users);
    }
}
