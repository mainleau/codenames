import Interface from '../../core/Interface.js';
import GameInterface from '../../interfaces/game/index.js';

export default class HomeInterface extends Interface {
    constructor(app, socket) {
        super();
        this.app = app;
        this.socket = socket;

        if(socket.readyState === 1) {
            socket.send(JSON.stringify(['game-list']));
        } else if(socket.readyState === 0) {
            socket.onopen = () => socket.send(JSON.stringify(['game-list']));
        }

        socket.onmessage = message => {
            const [event, data] = JSON.parse(message.data);
            if(event === 'game-list') {
                this.games = data;
                this.rerender();
            }
        }

        this.element = this.render();
        app.appendChild(this.element);
    }

    rerender(game) {
        const element = this.render(game);
        app.replaceChild(element, this.element);
        this.element = element;
    }

    render() {
        document.title = 'Nom de code';
        history.replaceState(null, '', '/');

        const element = document.createElement('div');
        element.id = 'home';

        const header = document.createElement('div');
        header.id = 'home-header';

        const title = document.createElement('span');
        title.id = 'home-title';
        title.textContent = 'Nom de code :';

        const subtitleContainer = document.createElement('div');
        subtitleContainer.id = 'home-subtitle-container';

        const firstSubtitle = document.createElement('span');
        firstSubtitle.className = 'home-subtitle';
        firstSubtitle.textContent = 'NIGHT';

        const secondSubtitle = document.createElement('span');
        secondSubtitle.className = 'home-subtitle';
        secondSubtitle.textContent = 'CLUB';

        subtitleContainer.append(firstSubtitle, secondSubtitle);

        header.append(title, subtitleContainer);

        const gamesContainer = document.createElement('div');
        gamesContainer.id = 'games-container';

        const optionsBar = document.createElement('div');

        const createGameCTA = document.createElement('div');
        createGameCTA.id = 'create-game-cta';
        createGameCTA.onclick = () => {
            this.element.remove();
            new GameInterface(this.app, this.socket);
        }

        const createGameText = document.createElement('span');
        createGameText.textContent = 'Créer une partie';

        createGameCTA.appendChild(createGameText);

        optionsBar.append(createGameCTA);

        const liveGames = document.createElement('div');

        const games = (this.games || []).map((liveGame => {
            const game = document.createElement('div');
            game.className = 'live-game';
            game.onclick = () => {
                this.element.remove();
                new GameInterface(this.app, this.socket, liveGame.id);
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

        liveGames.append(...games);

        gamesContainer.append(optionsBar, liveGames);

        element.append(header, gamesContainer);
        return element;
    }
}