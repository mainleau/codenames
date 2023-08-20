import { Collection } from '@discordjs/collection';
import jwt from 'jsonwebtoken';
import GameManager from './GameManager.js';
import Player from '../structures/Player.js';
import RankedGame from '../structures/RankedGame.js';
import { GAME_STATES } from '../../../utils/Constants.js';

export default class RankedGameManager extends GameManager {
    constructor(manager) {
        super(manager);

        this.queue = new Collection();

        this.options = {
            maxPlayerCount: 4,
            maxOperativeCount: 1,
            maxSpymasterCount: 1,
        };
    }

    disconnect(player) {
        if (!player.currentGameId) return;

        const game =
            this.get(player.currentGameId) || this.queue.get(player.currentGameId);

        game.remove(player);
    }

    reconnect(socket, user) {
        const { id } = socket.handshake.query;

        const game = this.get(id) || this.queue.get(id);
        if (!game) {
            socket.emit('error', {
                message: 'GAME_NOT_FOUND'
            });
            return socket.disconnect();
        }

        const player = game.rejoin(socket, user);
        return { game, player };
    }

    async connect(socket) {
        const { token } = socket.handshake.auth;

        let user = null;
        var content = {};
        if (token) {
            content = jwt.verify(token, process.env.JWT_SECRET);
            if(content.guest === false) user = await this.manager.client.users.fetchById(content.id);
        }

        if(!user) {
            socket.emit('error', {
                message: 'ACCOUNT_REQUIRED'
            });
            return socket.disconnect();
        }

        var player = null;

        var game = null;
        var reconnected = false;
        if (socket.handshake.query.id) {
            var { game, player } = this.reconnect(socket, user);
            reconnected = true;
        } else if (this.queue.size) {
            game = this.queue.first();
            player = new Player(socket, user);
        } else {
            game = this.create();
            this.queue.set(game.id, game);
            player = new Player(socket, user);
        }

        if(!game) {
            socket.emit('error', {
                message: 'GAME_NOT_FOUND'
            });
            return socket.disconnect();
        }

        socket.onAny((name, data) => {
            game.handle(player, { name, data });
        });

        socket.on('disconnect', () => this.disconnect(player));

        // TODO: check if player already in a game (or in this game), if so reject (or rejoin)
        if(!reconnected) game.add(player);

        if (game.players.size === this.options.maxPlayerCount) {
            this.state = GAME_STATES.STARTING;
            game.broadcast('game-starting', {
                state: this.state
            });
            setTimeout(() => game.start(), 3000);
        }
    }

    create() {
        const game = new RankedGame(this.manager);

        this.manager.client.words
            .fetch({
                count: 25,
                random: true,
            })
            .then(words => game.setWords(words));

        return game;
    }
}
