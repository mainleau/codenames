import Team from './Team.js';
import Component from '../../../structures/Component.js';
import HomeInterface from '../../home/index.js';

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


        upBanner.append();

        const team = new Team(this.game, this.team).create();

        element.append(upBanner, team);
        return element;
    }
}
