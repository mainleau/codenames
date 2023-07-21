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
            card.style.cursor = 'pointer';
            card.className = 'card';
            if(this.game.selectedCards.has(index)) card.classList.add('selected');

            const word = this.game.words ? this.game.words.at(index) : {};
            if([0, 1, -1, null].includes(word.team)) {
                card.classList.add(
                    word.team === 0 ? 'first-team'
                    : word.team === 1 ? 'second-team'
                    : word.team === -1 ? 'death'
                    : 'default'
                );
            }

            card.onclick = () => {
                if(!card.classList.contains(this.game.team ? 'second-team' : 'first-team')) return;
                this.game.emit('card-selected', {
                    target: index,
                    selected: !card.classList.contains('selected')
                });
            }

            const name = document.createElement('span');
            name.textContent = this.game.words ? word.name : '???';

            card.appendChild(name);
            return card;
        });

        element.append(...cards);
        return element;
    }
}