import Interface from '../../core/Interface.js';
import Board from './components/Board.js';
import LeftPanel from './components/LeftPanel.js';
import RightPanel from './components/RightPanel.js';
import BottomBoard from './components/BottomBoard.js';

export default class GameInterface extends Interface {
    constructor(manager, game) {
        super();
        this.manager = manager;
        this.game = game;

        this.app = document.body.firstChild;
        this.element = this.render();
        this.app.appendChild(this.element);
    }

    render() {
        const element = document.createElement('div');
        element.id = 'game';

        const leftPanel = new LeftPanel(this.game).create();

        const middlePanel = document.createElement('div');
        middlePanel.id = 'middle-panel';

        this.board = new Board(this.game, { size: 5 }).create();

        const bottomBoard = new BottomBoard(this.game).create();

        middlePanel.append(this.board, bottomBoard);

        const rightPanel = new RightPanel(this.game).create();

        element.append(leftPanel, middlePanel, rightPanel);
        return element;
    }
}