import Component from '../../../core/Component.js';
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

        const team = new Team(this.game, this.team).create();

        element.appendChild(team);
        return element;
    }
}