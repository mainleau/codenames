import Component from '../../../core/Component.js';

export default class ClueCountSelector extends Component {
    constructor(game) {
        super();
        this.game = game;
    }

    create(clueCountText) {
        const element = document.createElement('div');
        element.id = 'clue-count-selector';
        element.style.visibility = 'hidden';

        const numbers = Array.from([...Array(10).keys(), '∞'], (value) => {
            const numberContainer = document.createElement('div');
            numberContainer.className = 'number-container';

            const number = document.createElement('span');
            number.className = 'number';
            number.textContent = value;
            numberContainer.onclick = () => {
                clueCountText.textContent = value;
                element.style.visibility = 'hidden';
            }

            numberContainer.appendChild(number);
            return numberContainer;
        });

        element.append(...numbers);
        return element;
    }
}