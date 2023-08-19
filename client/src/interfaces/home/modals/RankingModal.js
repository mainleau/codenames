import Modal from '../../../structures/Modal.js';

export default class RankingModal extends Modal {
    constructor(api) {
        super({
            width: 500,
            height: 700
        });

        this.cache = [];
        api.core.rankings.fetchPoint().then(data => {
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
        title.textContent = 'Classement';

        const container = document.createElement('div');
        container.id = 'ranking-container';

        const ranking = this.cache.map((user, index) => {
            const userContainer = document.createElement('div');

            const userText = document.createElement('span');
            userText.textContent = `${index + 1} - ${user.username} (${user.points})`;

            userContainer.append(userText)
            return userContainer;
        });

        container.append(...ranking);

        this.element.append(title, container);

        return this.element;
    }

}