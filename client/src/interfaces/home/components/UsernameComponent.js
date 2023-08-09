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
        levelContainer.style.backgroundColor =
            this.user.level >= 10 ? '#a2deff'
            : this.user.level >= 5 ? '#b9ffb9'
            : 'palegoldenrod';

        // #FFCCCB#CCFFCD#CDCCFF

        const levelText = document.createElement('span');
        levelText.textContent = `${this.user.level}`;

        levelContainer.append(levelText);

        const usernameText = document.createElement('span');
        usernameText.className = 'username-text';
        usernameText.textContent = this.user.username;

        const badges = document.createElement('div');
        badges.id = 'badges';

        if(this.user.flags & 0x10) {
            const guardianBadge = document.createElement('span');
            guardianBadge.textContent = '🛡️';
            badges.append(guardianBadge);
        }

        if(this.user.flags & 0x01) {
            const earlyBirdBadge = document.createElement('span');
            earlyBirdBadge.textContent = '🐦';
            badges.append(earlyBirdBadge);
        }

        this.element.append(levelContainer, usernameText, /*badges.children.length ? badges : ''*/);
        return this.element;
    }
}