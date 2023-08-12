import UsernameComponent from './UsernameComponent.js';
import Component from '../../../structures/Component.js';
import ProfileModal from '../modals/ProfileModal.js';
// Import defaultAvatarImage from '../../../../assets/images/default-avatar.svg';

export default class ProfileComponent extends Component {
  constructor(manager) {
    super();

    this.cache = {};

    this.manager = manager;
    this.manager.client.users.fetchMe().then(user => {
      this.cache = user;
      this.rerender();
    });
  }

  create() {
    this.element = document.createElement('div');
    this.element.id = 'profile';

    const avatarContainer = document.createElement('div');
    avatarContainer.id = 'avatar-container';

    const username = this.cache.username ? new UsernameComponent(this.cache).create() : '...';
    if (this.cache.username) {
      username.onclick = event => {
        new ProfileModal().open(event, this.cache, true);
      };
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

    inventoryItems.append(goldContainer);

    inventory.append(inventoryTitle, inventoryItems);

    this.element.append(avatarContainer, inventory);
    return this.element;
  }
}
