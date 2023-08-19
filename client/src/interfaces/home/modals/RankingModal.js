import Modal from '../../../structures/Modal.js';
import UsernameComponent from '../components/UsernameComponent.js';

export default class RankingModal extends Modal {
    constructor(api, type) {
        super({
            width: 500,
            height: 700
        });

        this.type = type;

        this.cache = [];
        if(this.type === 0) api.core.rankings.fetchXP().then(data => {
            this.cache = data;
            this.rerender();
        });
        if(this.type === 1) api.core.rankings.fetchPoint().then(data => {
            this.cache = data;
            this.rerender();
        });
    }

    open(event) {
        this.render(event);
    }

    render(event) {
        super.render(event);
        this.element.id = 'ranking-modal';

        const title = document.createElement('span');
        title.textContent = `Classement des ${this.type === 0 ? 'XP' : 'Points'}`;

        const header = document.createElement('div');
        header.style.marginBottom = '10px';
        header.style.fontWeight = 'bold';

        const headerTexts = ['Rang', 'Points'].map(text => {
            const headerText = document.createElement('span');
            headerText.textContent = text;
            return headerText;
        });

        header.append(...headerTexts);

        const container = document.createElement('div');
        container.id = 'ranking-container';

        const ranking = this.cache.map((user, index) => {
            const userContainer = document.createElement('div');

            const rankText = document.createElement('span');
            rankText.textContent = `${index + 1} ${user.username} `;

            const countText = document.createElement('span');
            countText.textContent = this.type === 0 ? user.xp : user.points;

            userContainer.append(rankText, countText)
            return userContainer;
        });

        container.append(header, ...ranking);

        this.element.append(title, container);

        return this.element;
    }

}