import { validate as isUUID } from 'uuid';

export default class PlayerController {
    constructor(client) {
        this.client = client;
    }

    async fetch(req, res, next) {
        const id = req.params.id;
        if(!isUUID(id)) return next(new Error('INVALID_PLAYER_ID'));

        var player;
        try {
            var player = await this.client.fetchPlayer(id);
        } catch (error) {
            return next(error);
        }

        return res.send(player);
    }
}