import Interface from '../../core/Interface.js';
import Game from '../../core/Game.js';
import Board from './components/Board.js';
import LeftPanel from './components/LeftPanel.js';
import RightPanel from './components/RightPanel.js';
import BottomBoard from './components/BottomBoard.js';

export default class GameInterface extends Interface {
    constructor(app, id) {
        super();
        this.app = app;
        
        var url = `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.hostname}:8888/play`;
        this.socket = io(url);

        this.element = this.render(new Game(this, this.socket, id));
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

        const leftPanel = new LeftPanel(game, this).create();

        const middlePanel = document.createElement('div');
        middlePanel.id = 'middle-panel';

        this.board = new Board(game, { size: 5 }).create();

        const bottomBoard = new BottomBoard(game).create();

        middlePanel.append(this.board, bottomBoard);

        const rightPanel = new RightPanel(game).create();

        element.append(leftPanel, middlePanel, rightPanel);
        return element;
    }
}