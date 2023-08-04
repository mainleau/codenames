import Modal from '../../../structures/Modal.js';

export default class SettingsModal extends Modal {
    constructor(manager) {
        super({
            width: 550,
            height: 100
        });
        this.manager = manager;
    }

    open() {
        super.open(event);

        this.element.id = 'logout-modal';

        const changeUsernameCTA = document.createElement('div');
        changeUsernameCTA.onclick = () => {
            this.close();
            delete localStorage.token;
            this.manager.app.goAuth();
        }
        changeUsernameCTA.id = 'change-username-cta';

        const changeUsernameText = document.createElement('span');
        changeUsernameText.textContent = 'Se déconnecter';

        changeUsernameCTA.appendChild(changeUsernameText);

        this.element.append(changeUsernameCTA);
    }
}