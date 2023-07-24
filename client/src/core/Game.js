import { isUUID } from '../util/index.js';
import Collection from '../util/Collection.js';
import Team from './Team.js';
import PlayerManager from '../managers/PlayerManager.js';

export default class Game {
    started = null;
    words = null;
    turn = {
        team: null,
        role: null
    }
    constructor(socket, data) {
        this.socket = socket;

        this.players = new PlayerManager();

        this.selectedCards = new Map();
        this.reversedCards = new Map();

		this.teams = Array.from({ length: options.teamCount }, (_, index) => new Team(this, index));

        this.socket.onmessage = message => this.handle(message);
    }

    add(...player) {
        if(typeof player === 'array') {
            player.forEach(p => this.players.set(p.id, p));
        } else {
            this.players.set(player.id, player);
        }
    }

    remove(...player) {
        if(typeof player === 'array') {
            player.forEach(p => this.players.remove(p.id));
        } else {
            this.players.remove(player.id, player);
        }
    }

    get player() {
        return this.players.find(player => player.id === this.playerId) || {};
    }

    handle(message) {
        const [event, data] = JSON.parse(message.data);

        switch (event) {
            case 'game-joined':
                localStorage.setItem('last-game-id', data.id);
                this.playerId = data.playerId;
                this.turn = data.turn;
                history.replaceState(null, '', data.id);
                this.words = data.words.reduce((col, word) => {
                    return col.set(word.name, { name: word.name });
                }, new Collection());
                this.add({ id: data.id, username: data.username, team: data.team, role: data.role });
                this.board.rerender(this);
                break;
            case 'team-role-changed':
                var player = this.players.find(player => player.id === data.target);
                if(player.id === this.playerId) {
                    if(data.role === 0) {
                        this.words.forEach((word, index) => {
                            if(!this.reversedCards.has(index)) delete word.team;
                        });
                    }
                    this.team = data.team;
                    this.role = data.role
                    this.selectedCards.clear();
                }
                player.team = data.team;
                player.role = data.role;
                this.board.rerender(this);
                break;
            case 'username-changed':
                var player = this.players.find(player => player.id === data.target);
                player.username = data.username;
                this.board.rerender(this);
                break;
            case 'player-joined':
                this.add({ id: data.id, username: data.username, team: data.team, role: data.role });
                this.board.rerender(this);
                break;
            case 'player-leaved':
                this.remove({ id: data.id });
                this.board.rerender(this);
                break;
            case 'player-list':
                this.players = data;
                this.board.rerender(this);
                break;
            case 'word-list':
                this.words = data;
                this.board.rerender(this);
                break;
            case 'select-card':
                data.selected ? this.selectedCards.set(data.target) : this.selectedCards.delete(data.target);
                this.board.rerender(this);
                break;
            case 'game-started':
                this.turn = data.turn;
                if(data.words) {
                    this.words = data.words.reduce((col, word) => {
                        return col.set(word.name, { name: word.name, team: word.team });
                    }, new Collection());
                }
                this.board.rerender(this);
                break;
            case 'forwarded-clue':
                this.teams[this.turn.team].clues.set(data.word, { word: data.word, count: data.count });
                this.turn.role ^= true;
                this.selectedCards.clear();
                this.board.rerender(this);
                break;
            case 'card-used':
                if(data.team !== this.player.team || data.remainder === 0) {
                    this.turn.team ^= true;
                    this.turn.role ^= true;
                }
                const word = this.words.at(data.word);
                word.team = data.team;
                word.reversed = true;
                this.reversedCards.set(data.word);
                this.board.rerender(this);
                break;
            case 'game-ended':
                this.turn.team = null;
                this.turn.role = null;
                this.board.rerender(true);
                break;
        }
    }
}