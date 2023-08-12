import { Collection } from '@discordjs/collection';
import jwt from 'jsonwebtoken';
import { validate as isUUID } from 'uuid';
import GameManager from './GameManager.js';
import CustomGame from '../structures/CustomGame.js';
import Player from '../structures/Player.js';

export default class CustomGameManager extends GameManager {
    constructor(manager) {
        super(manager);

        this.options = {};
    }

    disconnect(player) {
        if (!player.currentGameId) return;

        const game = this.get(player.currentGameId);

        game.remove(player);
    }

    reconnect(socket, user) {
        const { id } = socket.handshake.query;

        const game = this.get(id);
        if (!game) return socket.disconnect();

        game.rejoin(socket, user);
    }

    async connect(socket) {
        const { token } = socket.handshake.auth;
        const id = socket.handshake.query.id;

        let user = null;
        if (token) {
            const content = jwt.verify(token, process.env.JWT_SECRET);
            user = await this.manager.client.users.fetchById(content.id);
        } // TODO: different and shorter id for anonymous users, kept in a localstorage token prop

        if (socket.handshake.query.id) return this.reconnect(socket, user);

        const player = new Player(socket, user);

        socket.on('disconnect', () => this.disconnect(player));

        let game = null;
        if (isUUID(id)) {
            game = this.get(id);
        } else {
            game = this.create();
            game.hostId = player.id; // TODO: add host flag to player
            this.set(game.id, game);
        }

        // TODO: check if player already in a game (or in this game), if so reject (or rejoin)
        game.add(player);

        socket.onAny((name, data) => {
            game.handle(player, socket, { name, data });
        });
    }

    create() {
        const game = new CustomGame(this.manager);

        this.manager.client.words
            .fetch({
                count: 25,
                random: true,
            })
            .then(words => game.setWords(words));

        return game;
    }
}
