import Component from '../../../core/Component.js';

export default class Login extends Component {
    constructor() {
        super();
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'login';

        const loginContainer = document.createElement('div');
        loginContainer.id = 'login-container';

        const username = document.createElement('div');
        username.id = 'username';
        
        const usernameText = document.createElement('span');
        usernameText.textContent = 'PSEUDONYME'

        const usernameInput = document.createElement('input');
        usernameInput.spellcheck = false;

        username.append(usernameText, usernameInput);
        
        const password = document.createElement('div');
        password.id = 'password';
        
        const passwordText = document.createElement('span');
        passwordText.textContent = 'MOT DE PASSE'
        
        const passwordInput = document.createElement('input');
        
        password.append(passwordText, passwordInput);

        const loginButton = document.createElement('div');
        loginButton.id = 'login-button-final';

        const loginButtonText = document.createElement('span');
        loginButtonText.textContent = 'Connecte-toi !';

        loginButton.appendChild(loginButtonText);

        loginContainer.append(username, password, loginButton);
 
        this.element.appendChild(loginContainer);
        return this.element;
    }
}