import UsernameComponent from './UsernameComponent.js';
import Component from '../../../structures/Component.js';
import ProfileModal from '../modals/ProfileModal.js';
import RankingModal from '../modals/RankingModal.js';
// Import defaultAvatarImage from '../../../../assets/images/default-avatar.svg';

export default class ProfileComponent extends Component {
    constructor(app) {
        super();

        this.cache = {};
        this.app = app;

        if(this.app.manager.api.isGuest) return;
        this.app.manager.api.core.users.fetchMe().then(user => {
            this.cache = user;
            this.rerender();
        });
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'profile-component';

        const avatarContainer = document.createElement('div');
        avatarContainer.id = 'avatar-container';

        const username = this.cache.username
            ? new UsernameComponent(this.cache, true, null, true).create()
            : '...';
        if (this.cache.username) {
            // username.onclick = event => {
            //     new ProfileModal().open(event, this.cache, true);
            // };
        }

        const avatar = document.createElement('div');
        avatar.id = 'avatar';

        const avatarImage = document.createElement('img');
        // AvatarImage.src = defaultAvatarImage;

        avatar.appendChild(avatarImage);

        avatarContainer.append(username, avatar);

        const inventory = document.createElement('div');
        inventory.id = 'inventory';

        const inventoryTitle = document.createElement('div');
        inventoryTitle.id = 'inventory-title';

        const inventoryTitleText = document.createElement('span');
        inventoryTitleText.innerText = 'Inventaire';

        inventoryTitle.appendChild(inventoryTitleText);

        const inventoryItems = document.createElement('div');
        inventoryItems.id = 'inventory-items';

        const goldContainer = document.createElement('div');

        const goldText = document.createElement('span');
        goldText.innerText = '🪙';

        const goldAmount = document.createElement('span');
        goldAmount.innerText = this.cache.gold ?? '...';

        goldContainer.append(goldText, goldAmount);

        const pointsContainer = document.createElement('div');
        pointsContainer.id = 'points-container';
        pointsContainer.onclick = event => {
            new RankingModal(this.app.manager.api).open(event);
        }

        const pointsText = document.createElement('span');
        pointsText.innerText = '🏆';

        const pointsAmount = document.createElement('span');
        pointsAmount.innerText = this.cache.points ?? '...';

        pointsContainer.append(pointsText, pointsAmount);

        inventoryItems.append(goldContainer, pointsContainer);

        inventory.append(inventoryTitle, inventoryItems);

        this.element.append(avatarContainer, inventory);
        return this.element;
    }
}
