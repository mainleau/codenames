import Component from '../../../core/Component.js';
import HomeInterface from '../../home/index.js';
import Team from './Team.js';

export default class LeftPanel extends Component {
    constructor(game) {
        super();
        this.game = game;
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
            this.game.socket.close();
            const home = new HomeInterface(this.game.manager.manager);
            document.body.firstChild.children[0].replaceWith(home.render());
        };
        backButton.textContent = '⬅️';

        options.appendChild(backButton);

        upBanner.appendChild(options);

        const team = new Team(this.game, this.team).create();

        element.append(upBanner, team);
        return element;
    }
}