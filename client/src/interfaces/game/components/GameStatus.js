import Component from '../../../structures/Component.js';

export default class GameStatus extends Component {
    constructor(game) {
        super();
        this.game = game;

        this.game.socket.on('game-started', () => {
            this.rerender();
        });

        this.game.socket.on('game-starting', () => {
            this.rerender()
        });

        this.game.socket.on('game-joined', () => {
            this.rerender();
        });

        this.game.socket.on('card-revealed', () => {
            this.rerender();
        });

        this.game.socket.on('clue-forwarded', () => {
            this.rerender();
        });
    }

    create() {
        const element = this.element = document.createElement('div');
        element.id = 'game-status-component';

        const gameStatusText = document.createElement('span');
        gameStatusText.innerHTML = this.game.state === null ? '...'
        : this.game.state === 0 ? 'En attente de joueurs...'
        : this.game.state === 4 ? 'La partie va commencer...'
        : this.game.turn.role === 1 ? `Les <span class="team-${this.game.turn.team}">espions</span> cherchent un indice`
        : `Les <span class="team-${this.game.turn.team}">agents</span> cherchent les cartes`;

        element.append(gameStatusText);
        return element;
    }
}