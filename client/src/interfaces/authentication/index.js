import Interface from '../../core/Interface.js';
import Login from './components/Login.js';

export default class AuthenticationInterface extends Interface {
    constructor() {
        super();
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
            this.element.append(new Login().create());
        }

        const loginButtonText = document.createElement('span');
        loginButtonText.textContent = "J'ai déjà un compte";

        loginButton.appendChild(loginButtonText);

        const registerButton = document.createElement('div');
        registerButton.id = 'register-button';

        const registerButtonText = document.createElement('span');
        registerButtonText.textContent = "Créer un compte";

        registerButton.appendChild(registerButtonText);

        container.append(loginButton, registerButton);

        this.element.append(container);
        return this.element;
    }
}