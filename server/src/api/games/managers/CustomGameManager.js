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
        const game = this.get(player.currentGameId);
        if(!player.currentGameId) return;

        game.remove(player);
        this.prepareDeletion(game);
    }

    reconnect(socket, user) {
        const { id } = socket.handshake.query;

        const game = this.get(id);
        if (!game) return socket.disconnect();

        const player = game.rejoin(socket, user);

        return { game, player};
    }

    async connect(socket) {
        const { token } = socket.handshake.auth;
        const id = socket.handshake.query.id;

        let user = {};
        var content = {};
        if (token) {
            content = jwt.verify(token, process.env.JWT_SECRET);
            if(content.guest === false) user = await this.manager.client.users.fetchById(content.id);
            else user.id = content.id;
        } // TODO: different and shorter id for anonymous users, kept in a localstorage token prop

        var player = null;
        var game = null;
        var reconnected = false;
        if(isUUID(id) && this.find(game => game.players.get(user.id))) {
            var { game, player } = this.reconnect(socket, user);
            reconnected = true;
        } else if (isUUID(id)) {
            player = new Player(socket, user);
            game = this.get(id);
        } else {
            player = new Player(socket, user);
            game = this.create();
            game.hostId = player.id; // TODO: add host flag to player
            this.set(game.id, game);
        }
        
        if(!game) {
            socket.emit('error', {
                message: 'GAME_NOT_FOUND'
            });
            return socket.disconnect();
        }

        player.guest = content.guest === true;

        // TODO: check if player already in a game (or in this game), if so reject (or rejoin)
        if(!reconnected) game.add(player);
        
        socket.onAny((name, data) => {
            game.handle(player, { name, data });
        });

        socket.on('disconnect', () => !game.state && this.disconnect(player));
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
