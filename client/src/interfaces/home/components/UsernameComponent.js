import Component from '../../../structures/Component.js';

export default class UsernameComponent extends Component {
    constructor(user) {
        super();

        this.user = user;
    }

    create() {
        this.element = document.createElement('div');
        this.element.className = 'username-component';

        const levelContainer = document.createElement('div');
        levelContainer.className = 'level-container';

        const levelText = document.createElement('span');
        levelText.textContent = `${this.user.level}`;

        levelContainer.append(levelText);

        const usernameText = document.createElement('span');
        usernameText.className = 'username-text';
        usernameText.textContent = this.user.username;

        this.element.append(levelContainer, usernameText);
        return this.element;
    }
}