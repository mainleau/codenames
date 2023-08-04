import Interface from '../../structures/Interface.js';

export default class RegisterInterface extends Interface {
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
        usernameText.textContent = "PSEUDONYME"

        const usernameInput = document.createElement('input');
        usernameInput.spellcheck = false;

        username.append(usernameText, usernameInput);

        const email = document.createElement('div');
        email.id = 'email';
        
        const emailText = document.createElement('span');
        emailText.textContent = 'ADRESSE E-MAIL'

        const emailInput = document.createElement('input');
        emailInput.spellcheck = false;

        email.append(emailText, emailInput);
        
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
                const { token } = await this.manager.auth.register({
                    email: emailInput.value,
                    password: passwordInput.value
                }, {
                    username: usernameInput.value,
                    referrer: new URLSearchParams(location.search).get('ref')
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
        loginButtonText.textContent = 'Enregistre-toi !';

        loginButton.appendChild(loginButtonText);

        loginContainer.append(username, email, password, loginButton);

        const backButton = document.createElement('span');
        backButton.id = 'back-button';
        backButton.onclick = () => {
            this.manager.app.goAuth();
        };
        backButton.textContent = '⬅️';
 
        this.element.append(backButton, loginContainer);
        return this.element;
    }
}