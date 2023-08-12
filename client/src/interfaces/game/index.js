import Board from './components/Board.js';
import BottomBoard from './components/BottomBoard.js';
import EndComponent from './components/EndComponent.js';
import LeftPanel from './components/LeftPanel.js';
import RightPanel from './components/RightPanel.js';
import SettingsComponent from './components/SettingsComponent.js';
import Interface from '../../structures/Interface.js';

export default class GameInterface extends Interface {
  constructor(manager, game) {
    super();
    this.manager = manager;
    this.game = game;

    this.app = document.body.firstChild;
    this.element = this.render();
    this.app.appendChild(this.element);

    this.game.socket.on('game-rewards', data => {
      const endComponent = new EndComponent(this.game, this.manager.manager.app, {
        winner: data.winner,
        xp: data.xp,
      }).create();
      this.element.appendChild(endComponent);
    });

    this.game.socket.on('game-joined', data => {
      if (data.name) return;
      this.game.name = `Partie ${data.id.slice(0, 3)}`;
      const settings = new SettingsComponent(this.game, data).create();
      this.app.appendChild(settings);
    });
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
