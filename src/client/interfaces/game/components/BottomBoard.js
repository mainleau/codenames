import Component from '../../../core/Component.js';

export default class BottomBoard extends Component {
    constructor(game) {
        super();
        this.game = game;
    }

    create() {
        const element = document.createElement('div');
        element.id = 'bottom-board';

        const clueCountContainer = document.createElement('div');
        clueCountContainer.id = 'clue-count-container';

        const clueNameInput = document.createElement('input');
        clueNameInput.spellcheck = false;
        clueNameInput.style.textTransform = true ? 'uppercase' : 'none';
        clueNameInput.id = 'clue-name-input';

        const giveClueCTA = document.createElement('div');
        giveClueCTA.id = 'give-clue-cta';

        const giveClueText = document.createElement('span');
        giveClueText.textContent = 'Envoyer';

        giveClueCTA.appendChild(giveClueText);

        element.append(clueCountContainer, clueNameInput, giveClueCTA);
        return element;
    }
}