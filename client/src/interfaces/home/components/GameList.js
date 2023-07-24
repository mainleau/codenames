import Component from '../../../core/Component.js';

export default class GameList extends Component {
    constructor(app) {
        super();
        this.app = app;
    }

    create() {
        this.element = document.createElement('div');

        const games = (this.games || []).map((liveGame => {
            const game = document.createElement('div');
            game.className = 'live-game';
            game.onclick = () => {
                const element = new GameInterface(this.app, liveGame.id);
                this.app.children[0].replaceChildren(element);
            }

            const teams = document.createElement('div');

            const firstTeamContainer = document.createElement('div');

            const firstTeamText = document.createElement('div');
            firstTeamText.textContent = liveGame.playerCount[0];

            firstTeamContainer.appendChild(firstTeamText);

            const secondTeamContainer = document.createElement('div');

            const secondTeamText = document.createElement('div');
            secondTeamText.textContent = liveGame.playerCount[1];

            secondTeamContainer.appendChild(secondTeamText);

            teams.append(firstTeamContainer, secondTeamContainer)

            game.append(teams);

            return game;
        }));

        this.element.append(...games);
        return this.element;
    }
}