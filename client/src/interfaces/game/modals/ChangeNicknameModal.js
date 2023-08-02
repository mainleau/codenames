import Modal from '../../../structures/Modal.js';

export default class ChangeNicknameModal extends Modal {
    constructor(game) {
        super({
            width: 550,
            height: 100
        });
        this.game = game;
    }

    open() {
        super.open(event);

        this.element.id = 'new-username-modal';

        const title = document.createElement('span');
        title.textContent = 'NOUVEAU SURNOM :';

        const newUsernameContainer = document.createElement('div');
        newUsernameContainer.id = 'new-username-container';

        const newUsernameInput = document.createElement('input');
        newUsernameInput.spellcheck = false;
        newUsernameInput.id = 'new-username-input';

        const changeUsernameCTA = document.createElement('div');
        changeUsernameCTA.id = 'change-username-cta';
        changeUsernameCTA.onclick = () => {
            this.close();
            this.game.emit('update-player', {
                nickname: newUsernameInput.value
            });
        }

        const changeUsernameText = document.createElement('span');
        changeUsernameText.textContent = 'Changer';

        changeUsernameCTA.appendChild(changeUsernameText);

        newUsernameContainer.append(newUsernameInput, changeUsernameCTA);

        this.element.append(title, newUsernameContainer);
    }
}