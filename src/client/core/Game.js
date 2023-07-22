import { isUUID } from '../util/index.js';
import Collection from './Collection.js';
import Team from './Team.js';

export default class Game {
    constructor(board, socket, id = null) {
        this.board = board;
        this.socket = socket;
        this.words = null;

        if(this.socket.readyState === 1) {
            if(isUUID(id)) {
                this.emit('join-game', { id });
            } else {
                this.emit('create-game');
            }
        } else if(this.socket.readyState === 0) {
            this.socket.onopen = () => {
                if(isUUID(id)) {
                    this.emit('join-game', { id });
                } else {
                    this.emit('create-game');
                }
            }
        }

        this.players = [];

        this.selectedCards = new Map();
        this.reversedCards = new Map();

        this.teams = [new Team(), new Team()];

        this.turn = {
            team: null,
            role: null
        };

        this.started = null;

        this.socket.onmessage = message => this.handle(message);
    }

    emit(event, data) {
		this.socket.send(JSON.stringify([event, data]));
    }

    add(...player) {
        this.players.push(...player);
    }

    get lastClue() {
        return this.teams[this.turn.team]?.clues.last() || {};
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