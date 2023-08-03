import Interface from '../../structures/Interface.js';
import GameList from './components/GameList.js';
import ProfileComponent from './components/ProfileComponent.js';

export default class HomeInterface extends Interface {
    constructor(manager) {
        super();
        this.manager = manager;
    }

    render() {
        document.title = 'Nom de code';
        history.replaceState(null, '', '/');

        const element = document.createElement('div');
        element.id = 'home';

        const menu = document.createElement('div');
        menu.id = 'menu';

        const loginButton = document.createElement('div');
        loginButton.id = 'login-button';

        const loginButtonText = document.createElement('span');
        loginButtonText.textContent = '⚙️';

        loginButton.appendChild(loginButtonText);

        menu.append(loginButton);

        const content = document.createElement('div');
        content.id = 'content';

        const profile = new ProfileComponent(this.manager).create();

        const gamesContainer = document.createElement('div');
        gamesContainer.id = 'games-container';

        const optionsBar = document.createElement('div');

        const createGameCTA = document.createElement('div');
        createGameCTA.id = 'create-game-cta';
        createGameCTA.onclick = () => {
            gameList.interval = clearInterval(gameList.interval);
            element.remove();
            this.manager.games.create();
        }

        const createGameText = document.createElement('span');
        createGameText.textContent = 'Créer une partie';

        createGameCTA.appendChild(createGameText);

        optionsBar.append(createGameCTA);

        const gameList = new GameList(this.manager);

        const liveGames = gameList.create();

        gamesContainer.append(optionsBar, liveGames);

        const other = document.createElement('div');
        other.id = 'other';

        content.append(profile, gamesContainer, other);
        element.append(menu, content);
        return element;
    }
}