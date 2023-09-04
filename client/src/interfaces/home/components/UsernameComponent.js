import Component from '../../../structures/Component.js';
import ProfileModal from '../modals/ProfileModal.js';

export default class UsernameComponent extends Component {
    constructor(user, onclick = true, nickname = null, completed = false, api) {
        super();

        this.user = user;
        this.api = api;
        this.onclick = onclick;

        this.user.nickname = nickname;
        this.completed = completed;
    }

    create() {
        this.element = document.createElement('div');
        this.element.className = 'username-component';
        if(this.onclick) this.element.onclick = event => {
            new ProfileModal(this.api).open(event, this.user, this.completed);
        }
        if(this.onclick) this.element.classList.add('clickable');

        const levelContainer = document.createElement('div');
        levelContainer.className = 'level-container';
        levelContainer.style.backgroundColor =
            this.user.level >= 10
                ? '#a2deff'
                : this.user.level >= 5
                ? '#b9ffb9'
                : 'palegoldenrod';

        // #FFCCCB#CCFFCD#CDCCFF

        const levelText = document.createElement('span');
        levelText.textContent = `${this.user.level}`;

        levelContainer.append(levelText);

        const usernameText = document.createElement('span');
        usernameText.className = 'username-text';
        usernameText.textContent = this.user.nickname || this.user.username;

        if(this.user.nickname) {
            usernameText.style.fontStyle = 'italic';
        }

        const badges = document.createElement('div');
        badges.id = 'badges';

        // if (this.user.flags & 0x10) {
        //     const guardianBadge = document.createElement('span');
        //     guardianBadge.textContent = '🛡️';
        //     badges.append(guardianBadge);
        // }

        // if (this.user.flags & 0x01) {
        //     const earlyBirdBadge = document.createElement('span');
        //     earlyBirdBadge.textContent = '🐦';
        //     badges.append(earlyBirdBadge);
        // }
        if(this.user.level) this.element.append(levelContainer);

        this.element.append(
            usernameText,
        );
        return this.element;
    }
}
