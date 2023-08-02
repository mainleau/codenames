import Component from '../../../structures/Component.js';
import ChangeNicknameModal from '../modals/ChangeNicknameModal.js';
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
        options.className = 'options';

        const changeUsernameModal = new ChangeNicknameModal(this.game);

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