import Component from '../../../core/Component.js';
import ClueCountSelector from './ClueCountSelector.js';

export default class BottomBoard extends Component {
    constructor(game) {
        super();
        this.game = game;
    }

    create() {
        const element = document.createElement('div');
        element.id = 'bottom-board';
        
        const clueBar = document.createElement('div');
        clueBar.id = 'clue-bar';

        const clueCountContainer = document.createElement('div');
        clueCountContainer.id = 'clue-count-container';
        clueCountContainer.onclick = () => {
            if(clueCountContainer.classList.contains('disabled')) return;
            clueCountSelector.style.visibility =
                clueCountSelector.style.visibility === 'hidden' ? 'visible'
                : 'hidden';
        }
        if(this.game.selectedCards.size) clueCountContainer.classList.add('disabled');

        const clueCountText = document.createElement('span');
        clueCountText.id = 'clue-count-text'
        clueCountText.textContent = this.game.selectedCards.size ? this.game.selectedCards.size : '-';

        clueCountContainer.appendChild(clueCountText);

        const clueCountSelector = new ClueCountSelector(this.game).create(clueCountText);

        const clueNameInput = document.createElement('input');
        clueNameInput.spellcheck = false;
        clueNameInput.style.textTransform = true ? 'uppercase' : 'none';
        clueNameInput.id = 'clue-name-input';

        const giveClueCTA = document.createElement('div');
        giveClueCTA.id = 'give-clue-cta';

        const giveClueText = document.createElement('span');
        giveClueText.textContent = 'Transmettre';

        giveClueCTA.appendChild(giveClueText);

        clueBar.append(clueCountSelector, clueCountContainer, clueNameInput, giveClueCTA);

        element.appendChild(clueBar);
        return element;
    }
}