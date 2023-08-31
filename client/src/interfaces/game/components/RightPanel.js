import Team from './Team.js';
import Component from '../../../structures/Component.js';

export default class RightPanel extends Component {
    constructor(game) {
        super();
        this.game = game;
        this.team = 1;

        this.game.socket.on('word-list', () => {
            this.rerender();
        });

        this.game.socket.on('card-revealed', () => {
            this.rerender();
        });
    }

    create() {
        const element = this.element = document.createElement('div');
        element.id = 'right-panel';

        const upBanner = document.createElement('div');
        upBanner.className = 'up-banner';

        const title = document.createElement('span');
        title.className = 'team-title';
        title.textContent = `EQUIPE ${this.team ? 'ROUGE' : 'BLEUE'} `;

        if(this.game.state === 1) {
            title.textContent += this.game.words.size ? ` ${this.game.teams[this.team].remainingWordCount}` : '...';
        }

        upBanner.append(title);

        const team = new Team(this.game, this.team).create();

        element.append(upBanner, team);
        return element;
    }
}
