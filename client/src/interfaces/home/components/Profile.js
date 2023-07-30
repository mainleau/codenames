import Component from '../../../core/Component.js';

export default class Profile extends Component {
    constructor(manager) {
        super();

        this.manager = manager;
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'profile';

        const avatarContainer = document.createElement('div');
        
        const username = document.createElement('span');
        const avatar = document.createElement('div');

        avatarContainer.appendChild(username, avatar);

        this.element.append(avatarContainer);
        return this.element;
    }
}