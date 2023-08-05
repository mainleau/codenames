import Component from '../../../structures/Component.js';

export default class FriendListComponent extends Component {
    constructor(manager) {
        super();

        this.cache = [];

        manager.client.friends.fetch().then(friends => {
            this.cache = friends;
            this.rerender();
        });
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'friend-list-component';

        const container = document.createElement('div');

        const titleContainer = document.createElement('div');
        titleContainer.id = 'container-title';

        const title = document.createElement('span');
        title.textContent = `Amis (${this.cache.length ?? '...'})`;

        titleContainer.appendChild(title);

        const list = document.createElement('div');
        list.id = 'list';
        const friends = (this.cache || []).map(friend => {
            const friendContainer = document.createElement('div');
            friendContainer.className = 'friend-container';

            const friendLevelContainer = document.createElement('div');
            friendLevelContainer.id = 'friend-level-container';

            const friendLevel = document.createElement('span');
            friendLevel.textContent = `${friend.level}`;

            friendLevelContainer.append(friendLevel);

            const friendUsername = document.createElement('span');
            friendUsername.id = 'friend-username';
            friendUsername.textContent = friend.username;

            friendContainer.append(friendLevelContainer, friendUsername);
            return friendContainer;
        });

        list.append(...friends);

        container.append(titleContainer, list);

        this.element.appendChild(container);
        return this.element;
    }
}