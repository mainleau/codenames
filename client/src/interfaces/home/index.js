import Interface from '../../structures/Interface.js';
import GameList from './components/GameList.js';
import ProfileComponent from './components/ProfileComponent.js';
import SettingsModal from './modals/SettingsModal.js';

export default class HomeInterface extends Interface {
    constructor(manager) {
        super();
        this.manager = manager;
    }

    render() {
        document.title = 'Nom de code (BÊTA)';
        history.replaceState(null, '', '/');

        const element = document.createElement('div');
        element.id = 'home';

        const menu = document.createElement('div');
        menu.id = 'menu';

        const loginButton = document.createElement('div');
        loginButton.id = 'login-button';
        loginButton.onclick = () => {
            new SettingsModal(this.manager).open();
        }

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

        const buyContainer = document.createElement('div');
        buyContainer.id = 'buy-container';
    
        const buy = document.createElement('div');
        buy.id = 'buy';
        
        const buyButton = document.createElement('div');
        buyButton.onclick = () => {
            location.href = 'https://buy.stripe.com/8wM00Kf009cybRK9AB';
        }
        const buyText = document.createElement('span');
        buyText.textContent = 'Devenir Earlybird';
        const buySubtitle = document.createElement('span');
        buySubtitle.textContent = '(xp double, accès bêta, fonctionnalités à venir, etc.)'
        buyButton.append(buyText, buySubtitle);
        buy.append(buyButton);

        buyContainer.append(buy);

        element.append(menu, content, buyContainer);
        return element;
    }
}