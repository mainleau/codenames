import Component from '../../../core/Component.js';
import Team from './Team.js';

export default class LeftPanel extends Component {
    create() {
        const element = document.createElement('div');
        element.id = 'left-panel';

        const team = new Team().create();

        element.appendChild(team);
        return element;
    }
}