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

        const clueWordInput = document.createElement('input');
        if(this.game.clue) clueWordInput.value = this.game.clue;
        clueWordInput.spellcheck = false;
        clueWordInput.style.textTransform = true ? 'uppercase' : 'none';
        clueWordInput.id = 'clue-word-input';
        clueWordInput.oninput = () => {
            this.game.clue = clueWordInput.value;
        }

        const giveClueCTA = document.createElement('div');
        giveClueCTA.id = 'give-clue-cta';
        giveClueCTA.className = 'cta';
        giveClueCTA.onclick = () => {
            giveClueCTA.onclick = null;
            this.game.emit('give-clue', {
                word: clueWordInput.value.toUpperCase(),
                count: !isNaN(clueCountText.textContent)
                    ? parseInt(clueCountText.textContent) : clueCountText.textContent
            });
        }

        const giveClueText = document.createElement('span');
        giveClueText.textContent = 'Transmettre';

        giveClueCTA.appendChild(giveClueText);

        clueBar.append(clueCountSelector, clueCountContainer, clueWordInput, giveClueCTA);
        
        const clueWordContainer = document.createElement('div');
        clueWordContainer.id = 'clue-word-container';

        const clueWordText = document.createElement('span');
        clueWordText.textContent = 'AA';//this.game.lastClue.word;

        const clueWordCount = document.createElement('span');
        clueWordCount.textContent = 1;//this.game.lastClue.count;

        clueWordContainer.append(clueWordText, clueWordCount);

        const startGameCTA = document.createElement('div');
        startGameCTA.id = 'start-game-cta';
        startGameCTA.className = 'cta';
        startGameCTA.onclick = () => {
            this.game.emit('start-game');
        }

        const startGameText = document.createElement('span');
        startGameText.textContent = 'Lancer la partie';

        startGameCTA.append(startGameText);

        if (this.game.turn.role === 0) {
            element.appendChild(clueWordContainer);
        } else if (this.game.turn.role === 1) {
            if(this.game.turn.team === this.game.player.team && this.game.turn.role === this.game.player.role) {
                element.appendChild(clueBar);
            }
        }

        if(this.game.turn.team === null) {
            element.appendChild(startGameCTA);
        }

        return element;
    }
}