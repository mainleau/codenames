import Interface from '../../core/Interface.js';
import Lobby from '../../core/Lobby.js';
import GameInterface from '../../interfaces/game/index.js';
import GameList from './components/GameList.js';

export default class HomeInterface extends Interface {
    constructor(app) {
        super();
        this.app = app;

        const lobby = new Lobby();
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
            element.remove();
            new GameInterface(this.app);
        }

        const createGameText = document.createElement('span');
        createGameText.textContent = 'Créer une partie';

        createGameCTA.appendChild(createGameText);

        optionsBar.append(createGameCTA);

        const liveGames = new GameList(this.app).create();

        gamesContainer.append(optionsBar, liveGames);

        element.append(header, gamesContainer);
        return element;
    }
}