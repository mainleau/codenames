import Modal from '../../../core/Modal.js';

export default class LoginModal extends Modal {
    constructor(manager) {
        super({
            width: 460,
            height: 460
        });
        this.manager = manager;
    }

    open() {
        super.open(event);
        this.element.id = 'login-modal';

        const usernameContainer = document.createElement('div');
        usernameContainer.id = 'username-container';

        const usernameTitle = document.createElement('span');
        usernameTitle.textContent = 'TON PSEUDONYME :';

        const usernameInput = document.createElement('input');
        usernameInput.spellcheck = false;
        usernameInput.id = 'username-input';

        usernameContainer.append(usernameTitle, usernameInput);

        const passwordContainer = document.createElement('div');
        passwordContainer.id = 'password-container';

        const passwordTitle = document.createElement('span');
        passwordTitle.textContent = 'TON MOT DE PASSE :';

        const passwordInput = document.createElement('input');
        passwordInput.spellcheck = false;
        passwordInput.type = 'password';
        passwordInput.id = 'password-input';

        passwordContainer.append(passwordTitle, passwordInput);

        const loginCTA = document.createElement('div');
        loginCTA.className = 'cta';
        loginCTA.id = 'login-cta';
        loginCTA.onclick = async () => {
            const response = await this.manager.client.login(usernameInput.value, passwordInput.value);
            if(response.id) {
                this.close();
                localStorage.id = response.id;
                localStorage.token = response.token;
            } else {
                passwordInput.value = '';
            }
        }

        const loginCTAText = document.createElement('span');
        loginCTAText.textContent = 'Se connecter';

        loginCTA.appendChild(loginCTAText);

        this.element.append(usernameContainer, passwordContainer, loginCTA);
    }
}