import User from '../../../api/structures/User.js';
import Component from '../../../structures/Component.js';
import ProfileModal from '../modals/ProfileModal.js';
import UsernameComponent from './UsernameComponent.js';

export default class FriendListComponent extends Component {
    constructor(manager) {
        super();

        this.manager = manager;

        this.cache = [];

        manager.client.friends.fetchWithGames().then(friends => {
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
            friendContainer.onclick = event => {
                const user = new User(this.manager.client, friend);
                new ProfileModal().open(event, user);
            }

            const username = new UsernameComponent(friend).create();

            const status = document.createElement('div');
            status.className = 'user-status';

            if(friend.currentGameId) status.onclick = () => {
                document.body.firstChild.children[0].remove();
                this.manager.games.join(friend.currentGameId);
            }

            if(friend.currentGameId) status.style.cursor = 'pointer';

            status.style.backgroundColor =
                friend.currentGameId !== null ? 'lightblue'
                : new Date(friend.online_at).getTime() + 10 * 60 * 1000 > Date.now() ? 'lightgreen'
                : 'salmon';

            friendContainer.append(username, status);
            return friendContainer;
        });

        list.append(...friends);

        container.append(titleContainer, list);

        this.element.appendChild(container);
        return this.element;
    }
}