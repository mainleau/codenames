import Component from '../../../core/Component.js';

export default class Board extends Component {
    constructor(game, { size }) {
        super(game);
        this.size = size;
    }

    create() {
        const element = document.createElement('div');
        element.id = 'board';

        const cards = Array.from({ length: this.size ** 2 }, (_, index) => {
            const card = document.createElement('div');
            card.className = 'card';

            const name = document.createElement('span');
            name.textContent = this.game.words ? this.game.words[index] : '???';

            card.appendChild(name);
            return card;
        });

        element.append(...cards);
        return element;
    }
}