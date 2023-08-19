import User from '../../../api/core/structures/User.js';
import Modal from '../../../structures/Modal.js';
import UsernameComponent from '../components/UsernameComponent.js';
import XPBarComponent from '../components/XPBarComponent.js';

export default class ProfileModal extends Modal {
    constructor() {
        super({
            width: 500,
            height: 700,
        });
    }

    open(event, user, complete = false) {
        super.open(event);

        this.element.id = 'profile-modal';

        const topHeader = document.createElement('div');
        topHeader.id = 'top-header';

        const username = new UsernameComponent(user, false).create();

        let XPBar = '';
        if (complete) {
            XPBar = new XPBarComponent(user).create();
        }

        topHeader.append(username, XPBar);

        const bottomHeader = document.createElement('div');
        bottomHeader.id = 'bottom-header';

        bottomHeader.append();

        const stats = document.createElement('div');
        stats.id = 'stats';

        const gameStats = document.createElement('div');

        const gamesWon = document.createElement('div');
        const gamesWonTitle = document.createElement('span');
        gamesWonTitle.textContent = 'Parties gagnées';
        const gamesWonCount = document.createElement('span');
        gamesWonCount.textContent = '...';
        gamesWon.append(gamesWonTitle, gamesWonCount);

        const gamesLost = document.createElement('div');
        const gamesLostTitle = document.createElement('span');
        gamesLostTitle.textContent = 'Parties perdues';
        const gamesLostCount = document.createElement('span');
        gamesLostCount.textContent = '...';
        gamesLost.append(gamesLostTitle, gamesLostCount);

        gameStats.append(gamesWon, gamesLost);

        const wordStats = document.createElement('div');

        const wordsFound = document.createElement('div');
        const wordsFoundTitle = document.createElement('span');
        wordsFoundTitle.textContent = 'Cartes trouvées';
        const wordsFoundCount = document.createElement('span');
        wordsFoundCount.textContent = '...';
        wordsFound.append(wordsFoundTitle, wordsFoundCount);

        const wordsMissed = document.createElement('div');
        const wordsMissedTitle = document.createElement('span');
        wordsMissedTitle.textContent = 'Cartes manquées';
        const wordsMissedCount = document.createElement('span');
        wordsMissedCount.textContent = '...';
        wordsMissed.append(wordsMissedTitle, wordsMissedCount);

        wordStats.append(wordsFound, wordsMissed);

        stats.append(gameStats, wordStats);

        user.fetchStats().then(() => {
            gamesWonCount.textContent = user.stats.games_won;
            gamesLostCount.textContent = user.stats.games_lost;

            wordsFoundCount.textContent = user.stats.words_found;
            wordsMissedCount.textContent = user.stats.words_missed;
        });

        this.element.append(topHeader, bottomHeader, stats);
        return this.element;
    }
}
