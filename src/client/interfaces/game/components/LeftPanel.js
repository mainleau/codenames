import Component from '../../../core/Component.js';
import HomeInterface from '../../home/index.js';
import Team from './Team.js';

export default class LeftPanel extends Component {
    constructor(game, gameInterface) {
        super();
        this.game = game;
        this.gameInterface = gameInterface;
        this.team = 0;
    }

    create() {
        const element = document.createElement('div');
        element.id = 'left-panel';

        const upBanner = document.createElement('div');
        upBanner.className = 'up-banner';

        const options = document.createElement('div');
        options.className = 'options';

        const backButton = document.createElement('span');
        backButton.onclick = () => {
            this.gameInterface.element.remove();
            new HomeInterface(this.gameInterface.app, this.gameInterface.socket);
        };
        backButton.textContent = '⬅️';

        options.appendChild(backButton);

        upBanner.appendChild(options);

        const team = new Team(this.game, this.team).create();

        element.append(upBanner, team);
        return element;
    }
}