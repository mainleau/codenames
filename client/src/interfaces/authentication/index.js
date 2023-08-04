import Interface from '../../structures/Interface.js';
import LoginInterface from './LoginInterface.js';
import RegisterInterface from './RegisterInterface.js';

export default class AuthenticationInterface extends Interface {
    constructor(manager, ref) {
        super();
        this.ref = ref;

        this.manager = manager;
    }

    render() {
        this.element = document.createElement('div');
        this.element.id = 'authentication';

        const container = document.createElement('div');
        container.id = 'container';

        const loginButton = document.createElement('div');
        loginButton.id = 'login-button';
        loginButton.onclick = () => {
            this.element.firstChild.style.display = 'none';
            const interf = new LoginInterface(this.manager);
            this.manager.app.element.firstChild.append(interf.render());
        }

        const loginButtonText = document.createElement('span');
        loginButtonText.textContent = "J'ai déjà un compte";

        loginButton.appendChild(loginButtonText);

        const registerButton = document.createElement('div');
        registerButton.id = 'register-button';
        registerButton.onclick = () => {
            this.element.firstChild.style.display = 'none';
            const interf = new RegisterInterface(this.manager);
            this.manager.app.element.firstChild.append(interf.render());
        }

        const registerButtonText = document.createElement('span');
        registerButtonText.textContent = "Créer un compte";

        registerButton.appendChild(registerButtonText);

        container.append(loginButton, registerButton);

        this.element.append(container);
        return this.element;
    }
}