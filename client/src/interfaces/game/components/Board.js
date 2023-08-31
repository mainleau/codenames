import Component from '../../../structures/Component.js';

export default class Board extends Component {
    constructor(game, { size }) {
        super();
        this.game = game;
        this.size = size;

        this.game.socket.on('game-joined', data => {
            history.replaceState(null, '', data.id);
            this.game.playerId = data.player.id;
            this.rerender();
        });

        this.game.socket.on('word-list', () => {
            this.rerender();
        });

        this.game.socket.on('card-revealed', data => {
            const word = this.game.words.get(data.word);
            word.revealed = true;
            word.team = data.team;
            this.game.clueRemainder = data.clueRemainder;
            this.rerender();
        });

        this.game.socket.on('card-selected', data => {
            this.game.words.get(data.word).selected = data.selected;
            this.rerender();
        });
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'board';

        const cards = Array.from({ length: this.size ** 2 }, (_, index) => {
            const word = this.game.words ? this.game.words.at(index) : {};

            const card = document.createElement('div');
            card.className = 'card';

            card.style.cursor = 'pointer';

            if (word && 'revealed' in word) {
                card.classList.add('reversed');
            }

            if (this.game.reversedCards.includes(index)) {
                card.classList.add('reversed');
            }

            if (word && word.selected) {
                card.classList.add('selected');
            }

            if (word && [0, 1, -1, null].includes(word.team)) {
                card.classList.add(
                    word.team === 0
                        ? 'first-team'
                        : word.team === 1
                        ? 'second-team'
                        : word.team === -1
                        ? 'death'
                        : 'default',
                );
            }

            card.onclick = () => {
                if (this.game.turn.team === this.game.player.team) {
                    if (
                        this.game.turn.role === this.game.player.role &&
                        this.game.player.role === 1
                    ) {
                        if (
                            !card.classList.contains(
                                this.game.player.team ? 'second-team' : 'first-team',
                            )
                        ) return;
                        this.game.emit('select-card', {
                            word: this.game.words.at(index).id,
                            selected: !card.classList.contains('selected'),
                        });
                    } else if (
                        this.game.turn.role === this.game.player.role &&
                        this.game.player.role === 0
                    ) {
                        this.game.emit('reveal-card', {
                            word: word.id,
                        });
                    }
                }
            };

            const name = document.createElement('span');
            name.textContent = this.game.words.size ? word.name : '???';
            card.appendChild(name);
            return card;
        });

        this.element.append(...cards);
        return this.element;
    }
}
