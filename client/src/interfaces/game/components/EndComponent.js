import Component from '../../../structures/Component.js';

export default class EndComponent extends Component {
    constructor(game, app, data) {
        super();
        this.game = game;
        this.app = app;
        this.data = data;

        this.gameInterface = document.body.firstChild.firstChild;
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'end-component';

        const blurMask = document.createElement('div');
        blurMask.id = 'blur-mask';

        const container = document.createElement('div');
        container.id = 'container';

        const title = document.createElement('span');
        title.id = 'title';
        title.textContent = this.data.winner === this.game.player.team ? 'VICTOIRE' : 'DEFAITE';

        const score = document.createElement('div');
        score.id = 'scores';

        const result = document.createElement('span');
        result.textContent = `${this.data.winner === this.game.player.team ? 'Partie gagnée' : 'Partie perdue'} :
        + ${this.data.xp}xp`;

        // var span;
        // if(this.data.scores.goodCards) {
        //     span = document.createElement('span');
        //     span.textContent = `Bonnes cartes : + ${this.data.scores.goodCards * 15}xp`;
        // };

        score.append(result);

        const button = document.createElement('div');
        button.className = 'cta';
        button.id = 'button';
        button.onclick = () => {
            this.app.goHome();
        }
        const buttonText = document.createElement('span');
        buttonText.textContent = "Aller à l'accueil";

        button.append(buttonText);

        container.append(title, score, button);

        this.gameInterface.appendChild(blurMask);
        this.element.append(container);
        return this.element;
    }
}