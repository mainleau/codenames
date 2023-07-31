import Component from '../../../core/Component.js';

export default class Profile extends Component {
    constructor(manager) {
        super();

        this.cache = {
            gold: 0
        }

        this.manager = manager;
        this.manager.client.fetchPlayer(localStorage.id).then(player => {
            this.cache.gold = player.gold;
            this.rerender();
        });
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'profile';

        const avatarContainer = document.createElement('div');
        avatarContainer.id = 'avatar-container';
        
        const username = document.createElement('span');
        const avatar = document.createElement('div');

        avatarContainer.appendChild(username, avatar);

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
        goldAmount.innerText = this.cache.gold;

        goldContainer.append(goldText, goldAmount);

        inventoryItems.append(goldContainer);

        inventory.append(inventoryTitle, inventoryItems);

        this.element.append(avatarContainer, inventory);
        return this.element;
    }
}