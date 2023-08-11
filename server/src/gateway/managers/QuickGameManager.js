import { Collection } from "@discordjs/collection";
import jwt from 'jsonwebtoken';
import Player from '../structures/Player.js';
import QuickGame from '../structures/QuickGame.js';
import GameManager from "./GameManager.js";

export default class QuickGameManager extends GameManager {
    constructor(manager) {
        super(manager);

        this.queue = new Collection();

        this.options = {
            maximumPlayerNumber: 6,
            maximumOperativeNumber: 2,
            maximumSpymasterNumber: 1,
        }
    }

    disconnect(player) {
        if(!player.currentGameId) return;

        const game = this.get(player.currentGameId)
            || this.queue.get(player.currentGameId);

        game.remove(player);
    }

    reconnect(socket, user) {
        const id = socket.handshake.query.id;

        const game = this.get(id);
        if(!game) return socket.disconnect();

        game.rejoin(socket, user);
    }
    
    async connect(socket) {
        const token = socket.handshake.auth.token;

		var user = null;
		if(token) {
			const content = jwt.verify(token, process.env.JWT_SECRET);
			user = await this.manager.client.users.fetchById(content.id);
		} // TODO: different and shorter id for anonymous users, kept in a localstorage token prop

        if(socket.handshake.query.id) return this.reconnect(socket, user);

		const player = new Player(socket, user);

        socket.on('disconnect', () => this.disconnect(player));

        var game = null;
        if(this.queue.size) {
            game = this.queue.first();
        } else {
            game = await this.create();
            this.queue.set(game.id, game);
        }

        // TODO: check if player already in a game (or in this game), if so reject (or rejoin)
        game.add(player);

        if(game.players.size === this.options.maximumPlayerNumber) {
            this.queue.delete(game.id);
            this.set(game.id, game);
        }

        socket.onAny((name, data) => {
            game.handle(player, socket, { name, data });
        });
    }

    async create() {
        // TODO: remove async words setup, create QuickGame#setWords() method
        const words = await this.manager.client.words.fetch({
            count: 25,
            random: true
        });

        const game = new QuickGame(this.manager.client, this.manager.io, words);
        return game;
    }
}