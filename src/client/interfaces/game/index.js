import Interface from '../../core/Interface.js';
import Game from '../../core/Game.js';
import Board from './components/Board.js';
import LeftPanel from './components/LeftPanel.js';

export default class GameInterface extends Interface {
    constructor(app) {
        super();
        this.element = this.render(new Game(this));
        app.appendChild(this.element);
    }

    rerender(game) {
        const element = this.render(game);
        app.replaceChild(element, this.element);
        this.element = element;
    }

    render(game) {
        const element = document.createElement('div');
        element.id = 'game'

        const leftPanel = new LeftPanel().create();

        const middlePanel = document.createElement('div');
        middlePanel.id = 'middle-panel';

        this.board = new Board(game, { size: 5 }).create();

        const bottomBoard = document.createElement('div');
        bottomBoard.id = 'bottom-board';

        middlePanel.append(this.board, bottomBoard);

        const rightPanel = document.createElement('div');
        rightPanel.id = 'right-panel';

        element.append(leftPanel, middlePanel, rightPanel);
        return element;
    }
}