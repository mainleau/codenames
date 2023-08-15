import Component from '../../../structures/Component.js';
import ChangeNicknameModal from '../modals/ChangeNicknameModal.js';

export default class TopBar extends Component {
    constructor(game, app) {
        super();
        this.game = game;
        this.app = app;

        // TODO: create GAME_PHASES constants

        this.phase = 0;

        this.game.socket.on('game-started', data => {
            this.phase = 1;
            this.rerender();
        });

        this.game.socket.on('card-revealed', () => {
            this.phase = 1;
            this.rerender();
        });

        this.game.socket.on('clue-forwarded', () => {
            this.phase = 2;
            this.rerender();
        });
    }

    create() {
        const element = this.element = document.createElement('div');
        element.id = 'top-bar';

        const left = document.createElement('div');
        left.id = 'top-bar-left';

        const optionsLeft = document.createElement('div');
        optionsLeft.className = 'options';

        const backButton = document.createElement('span');
        backButton.onclick = () => {
            this.game.socket.close();
            this.app.goHome();
        };
        backButton.textContent = '⬅️';

        optionsLeft.appendChild(backButton);

        left.append(optionsLeft);

        const middle = document.createElement('span');
        middle.id = 'top-bar-middle';

        const gameStatus = document.createElement('div');
        gameStatus.id = 'game-status';

        const gameStatusText = document.createElement('span');
        gameStatusText.textContent = !this.phase ? 'En attente de joueurs...'
            : this.phase === 1 ? 'Les espions cherchent un indice'
            : 'Les agents cherchent les cartes';

        gameStatus.append(gameStatusText);

        middle.append(gameStatus);

        const right = document.createElement('div');
        right.id = 'top-bar-right';
        
        const optionsRight = document.createElement('div');
        optionsRight.className = 'options';

        const changeUsernameModal = new ChangeNicknameModal(this.game);

        const changeUsernameCTA = document.createElement('span');
        changeUsernameCTA.onclick = event => changeUsernameModal.open(event);
        changeUsernameCTA.textContent = '🏷️';

        const settingsCTA = document.createElement('span');
        settingsCTA.textContent = '⚙️';

        optionsRight.append(changeUsernameCTA, settingsCTA);

        right.append(optionsRight);

        element.append(left, middle, right);
        return element;
    }
}
