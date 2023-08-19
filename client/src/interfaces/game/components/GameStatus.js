import Component from '../../../structures/Component.js';

export default class GameStatus extends Component {
    constructor(game) {
        super();
        this.game = game;

        this.game.socket.on('game-started', () => {
            this.rerender();
        });

        this.game.socket.on('game-joined', data => {
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
        gameStatusText.textContent = !this.game.state ? 'En attente de joueurs...'
        : this.game.turn === 1 ? 'Les espions cherchent un indice'
        : 'Les agents cherchent les cartes';

        element.append(gameStatusText);
        return element;
    }
}