import Component from '../../../structures/Component.js';

export default class GameList extends Component {
    constructor(manager) {
        super();
        this.manager = manager;
        this.games = [null, null, null];
        this.fetchGames();
        this.interval = setInterval(() => {
            if(!document.body.contains(this.element)) {
                return this.interval = clearInterval(this.interval);
            }
            this.fetchGames();
        }, 10 * 60 * 1000);
    }

    async fetchGames() {
        const games = await this.manager.client.games.fetch();
        this.games = games.reverse().concat(new Array(3).fill(null)).slice(0, 3);
        this.rerender();
    }

    create() {
        this.element = document.createElement('div');
        
        const games = this.games.map((liveGame => {
            const game = document.createElement('div');
            if(liveGame !== null) game.style.cursor = 'pointer'; else game.style.opacity = 0.5;
            game.className = 'live-game';
            if(liveGame !== null) game.onclick = () => {
                document.body.firstChild.children[0].remove();
                this.manager.games.join(liveGame.id);
            }

            const name = document.createElement('span');
            name.className = 'name';
            name.textContent = liveGame !== null ? liveGame.name || 'Partie sans nom' : '';

            const teams = document.createElement('div');
            teams.className = 'teams';

            const firstTeamContainer = document.createElement('div');

            const firstTeamText = document.createElement('span');
            firstTeamText.textContent = liveGame?.playerCountByTeam[0];

            firstTeamContainer.appendChild(firstTeamText);

            const secondTeamContainer = document.createElement('div');

            const secondTeamText = document.createElement('span');
            secondTeamText.textContent = liveGame?.playerCountByTeam[1];

            secondTeamContainer.appendChild(secondTeamText);

            teams.append(firstTeamContainer, secondTeamContainer);

            const timeCount = Math.floor((Date.now() - liveGame?.startTime) / 1000);

            const time = document.createElement('span');
            time.className = 'time';
            time.textContent =
            timeCount > 60 ? `il y a plus de ${Math.floor(timeCount / 60)} minutes`
            : `il y a ${timeCount}s`;


            if(liveGame !== null) game.append(name, time, teams);

            return game;
        }));

        this.element.append(...games);
        return this.element;
    }
}