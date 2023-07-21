import Component from '../../../core/Component.js';
import ChangeUsernameModal from '../modals/ChangeUsernameModal.js';
import Team from './Team.js';

export default class RightPanel extends Component {
    constructor(game) {
        super();
        this.game = game;
        this.team = 1;
    }

    create() {
        const element = document.createElement('div');
        element.id = 'right-panel';

        const upBanner = document.createElement('div');
        upBanner.className = 'up-banner';

        const options = document.createElement('div');
        options.id = 'options';

        const changeUsernameModal = new ChangeUsernameModal(this.game);

        const changeUsernameCTA = document.createElement('span');
        changeUsernameCTA.onclick = event => changeUsernameModal.open(event);
        changeUsernameCTA.textContent = '🏷️';

        const settingsCTA = document.createElement('span');
        settingsCTA.textContent = '⚙️';
        
        options.append(changeUsernameCTA, settingsCTA);

        upBanner.appendChild(options);

        const team = new Team(this.game, this.team).create();

        element.append(upBanner, team);
        return element;
    }
}