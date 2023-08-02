import Component from '../../../structures/Component.js';
import ClueCountSelector from './ClueCountSelector.js';

export default class BottomBoard extends Component {
    constructor(game) {
        super();
        this.game = game;

        this.game.socket.on('game-joined', data => {
            this.game.started = data.started;
            this.game.turn = data.turn;
            this.rerender();
        });

        this.game.socket.on('game-started', data => {
            this.game.started = true;
            this.game.turn = data.turn;
            this.rerender();
        });

        this.game.socket.on('player-updated', data => {
            if(data.id === this.game.playerId) this.rerender();
        });

        this.game.socket.on('clue-forwarded', data => {
            this.game.teams[this.game.turn.team].clues.set(this.game.teams[this.game.turn.team].size, {
                word: data.word,
                count: data.count,
                relatedWords: data.relatedWords
            });
            this.game.turn.role ^= true;
            this.rerender();
        });

        this.game.socket.on('clue-list', data => {
            this.game.clues.add(data);
            this.rerender();
        });

        this.game.socket.on('card-revealed', data => {
            if(data.team !== this.game.turn.team || data.clueRemainder === 0) {
                this.game.turn.team ^= true;
                this.game.turn.role ^= true;
            }
            this.rerender();
        });

        this.game.socket.on('card-selected', () => {
            this.rerender();
        });
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'bottom-board';
        
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
        if(this.game.words.selected.size) clueCountContainer.classList.add('disabled');

        const clueCountText = document.createElement('span');
        clueCountText.id = 'clue-count-text'
        clueCountText.textContent = this.game.words.selected.size ? this.game.words.selected.size : '-';

        clueCountContainer.appendChild(clueCountText);

        const clueCountSelector = new ClueCountSelector(this.game).create(clueCountText);

        const clueWordInput = document.createElement('input');
        // if(this.game.clue) clueWordInput.value = this.game.clue;
        clueWordInput.spellcheck = false;
        clueWordInput.style.textTransform = true ? 'uppercase' : 'none';
        clueWordInput.id = 'clue-word-input';
        clueWordInput.oninput = () => {
            // this.game.clue = clueWordInput.value;
        }

        const giveClueCTA = document.createElement('div');
        giveClueCTA.id = 'give-clue-cta';
        giveClueCTA.className = 'cta';
        giveClueCTA.onclick = () => {
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
        clueWordText.textContent = this.game.clues.size ? this.game.clues.last().word : '???'

        const clueWordCount = document.createElement('span');
        clueWordCount.textContent = this.game.clues.size ? this.game.clues.last().count : '?'

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
            this.element.appendChild(clueWordContainer);
        }
        
        if (this.game.turn.role === 1) {
            if(this.game.turn.team === this.game.player.team && this.game.turn.role === this.game.player.role) {
                this.element.appendChild(clueBar);
            }
        }

        if(this.game.started === false) {
            this.element.appendChild(startGameCTA);
        }

        return this.element;
    }
}