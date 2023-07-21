import Modal from '../../../core/Modal.js';

export default class ChangeUsernameModal extends Modal {
    constructor(game) {
        super({
            width: 550,
            height: 100
        });
        this.game = game;

        this.element.className = 'new-username-modal';

        const title = document.createElement('span');
        title.textContent = 'NOUVEAU PSEUDONYME :';

        const newUsernameContainer = document.createElement('div');
        newUsernameContainer.id = 'new-username-container';

        const newUsernameInput = document.createElement('input');
        newUsernameInput.spellcheck = false;
        newUsernameInput.id = 'new-username-input';

        const changeUsernameCTA = document.createElement('div');
        changeUsernameCTA.id = 'change-username-cta';

        const changeUsernameText = document.createElement('span');
        changeUsernameText.onclick = () => {
            this.open();
            this.game.emit('change-username', {
                username: newUsernameInput.value
            });
        }
        changeUsernameText.textContent = 'Changer';

        changeUsernameCTA.appendChild(changeUsernameText);

        newUsernameContainer.append(newUsernameInput, changeUsernameCTA);

        this.element.append(title, newUsernameContainer);
    }
}