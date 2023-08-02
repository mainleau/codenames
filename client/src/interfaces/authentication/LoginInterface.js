import Interface from '../../structures/Interface.js';

export default class LoginInterface extends Interface {
    constructor(manager) {
        super();

        this.manager = manager;
    }

    render() {
        this.element = document.createElement('div');
        this.element.id = 'login';

        const loginContainer = document.createElement('div');
        loginContainer.id = 'login-container';

        const username = document.createElement('div');
        username.id = 'username';
        
        const usernameText = document.createElement('span');
        usernameText.textContent = 'ADRESSE ELECTRONIQUE'

        const usernameInput = document.createElement('input');
        usernameInput.spellcheck = false;

        username.append(usernameText, usernameInput);
        
        const password = document.createElement('div');
        password.id = 'password';
        
        const passwordText = document.createElement('span');
        passwordText.textContent = 'MOT DE PASSE'
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';

        password.append(passwordText, passwordInput);

        const loginButton = document.createElement('div');
        loginButton.id = 'login-button-final';
        loginButton.onclick = async () => {
            if(usernameInput.value && passwordInput.value) {
                const { token } = await this.manager.auth.login({
                    email: usernameInput.value, password: passwordInput.value
                });
                if(token) {
                    localStorage.token = token;
                    this.manager.app.goHome();
                } else {
                    passwordInput.value = '';
                }
            }
        }

        const loginButtonText = document.createElement('span');
        loginButtonText.textContent = 'Connecte-toi !';

        loginButton.appendChild(loginButtonText);

        loginContainer.append(username, password, loginButton);
 
        this.element.appendChild(loginContainer);
        return this.element;
    }
}