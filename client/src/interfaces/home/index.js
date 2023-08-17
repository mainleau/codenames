import FriendListComponent from './components/FriendListComponent.js';
import GameList from './components/GameList.js';
import ProfileComponent from './components/ProfileComponent.js';
import Interface from '../../structures/Interface.js';
import TopBarComponent from './components/TopBarComponent.js';

export default class HomeInterface extends Interface {
    constructor(app) {
        super();
        this.app = app;
    }

    render() {
        history.replaceState(null, '', '/');

        this.element = document.createElement('div');
        this.element.id = 'home';

        const topBar = new TopBarComponent(this.app).create();

        const content = document.createElement('div');
        content.id = 'content';

        const profile = new ProfileComponent(this.app).create();
        if(!this.app.manager.api.token) profile.style.filter = 'brightness(0.5)';

        const gamesContainer = document.createElement('div');
        gamesContainer.id = 'games-container';

        const optionsBar = document.createElement('div');
        optionsBar.id = 'options-bar';

        const createGameCTA = document.createElement('div');
        createGameCTA.className = 'game-cta';
        createGameCTA.onclick = () => {
            this.element.remove();
            this.app.api.games.create(0x01);
        };

        const createGameText = document.createElement('span');
        createGameText.textContent = 'Créer une partie personnalisée';

        createGameCTA.appendChild(createGameText);

        optionsBar.append(createGameCTA);

        const gameList = new GameList(this.app);

        const liveGames = gameList.create();

        gamesContainer.append(optionsBar, liveGames);

        const middle = document.createElement('div')
        middle.id = 'middle';

        const gameCTAs = document.createElement('div');
        gameCTAs.id = 'game-ctas';

        const joinGameCTA = document.createElement('div');
        joinGameCTA.className = 'game-cta';
        joinGameCTA.onclick = () => {
            this.element.remove();
            this.api.games.join(null, 0x00);
        };

        const joinGameText = document.createElement('span');
        joinGameText.textContent = 'Partie rapide ⚡';

        joinGameCTA.appendChild(joinGameText);

        const joinRankedGameCTA = document.createElement('div');
        joinRankedGameCTA.className = 'game-cta';
        joinRankedGameCTA.onclick = () => {
            this.element.remove();
            this.api.games.join(null, 0x02);
        };

        const joinRankedGameText = document.createElement('span');
        joinRankedGameText.textContent = 'Partie classée 🏆';

        joinRankedGameCTA.appendChild(joinRankedGameText);

        gameCTAs.append(joinGameCTA, joinRankedGameCTA);

        middle.append(gameCTAs, gamesContainer)

        const other = new FriendListComponent(this.app).create();
        if(!localStorage.token) other.style.filter = 'brightness(0.5)';

        content.append(profile, middle, other);

        const buyContainer = document.createElement('div');
        buyContainer.id = 'buy-container';

        const buy = document.createElement('div');
        buy.id = 'buy';

        const buyButton = document.createElement('div');
        buyButton.onclick = () => {
            location.href = 'https://buy.stripe.com/8wM00Kf009cybRK9AB';
        };
        const buyText = document.createElement('span');
        buyText.textContent = 'Devenir Earlybird';
        const buySubtitle = document.createElement('span');
        buySubtitle.textContent =
            '(xp double, accès bêta, fonctionnalités à venir, etc.)';
        buyButton.append(buyText, buySubtitle);
        buy.append(buyButton);

        buyContainer.append(buy);

        this.element.append(topBar, content, buyContainer);
        return this.element;
    }
}
