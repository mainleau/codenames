import Board from './components/Board.js';
import BottomBoard from './components/BottomBoard.js';
import EndComponent from './components/EndComponent.js';
import LeftPanel from './components/LeftPanel.js';
import RightPanel from './components/RightPanel.js';
import SettingsComponent from './components/SettingsComponent.js';
import Interface from '../../structures/Interface.js';
import ChangeNicknameModal from './modals/ChangeNicknameModal.js';
import GameStatus from './components/GameStatus.js';

export default class GameInterface extends Interface {
    constructor(app, game) {
        super(app);
        this.manager = app.manager;
        this.game = game;

        this.game.socket.on('game-rewards', data => {
            const endComponent = new EndComponent(this.game, this.manager.manager.app, data).create();
            this.element.appendChild(endComponent);
        });

        this.game.socket.on('game-joined', data => {
            this.game.state = data.state;
            this.game.rules = data.rules;
            this.game.settings = data.settings;
            this.game.turn = data.turn;
            this.game.hostId = data.hostId
            if(!this.game.players.get(data.player.id)) {
                this.game.players.set(data.player.id, data.player);
            }
            this.game.playerId = data.player.id;
            if(!data.name && data.hostId === data.player.id) {
                const settings = new SettingsComponent(this.game, data).create()
                this.app.element.append(settings);
            }
            this.game.name = data.name || `Partie ${data.id.slice(0, 3)}`;
        });
    }

    render() {
        this.element = document.createElement('div');
        this.element.id = 'game';

        const left = document.createElement('div');
        left.id = 'left';

        const topLeftPanel = document.createElement('div');
        topLeftPanel.id = 'top-left-panel';

        const optionsLeft = document.createElement('div');
        optionsLeft.className = 'options';

        const backButton = document.createElement('span');
        backButton.onclick = () => {
            this.game.socket.close();
            this.app.goHome();
        };
        backButton.textContent = '⬅️';

        optionsLeft.appendChild(backButton);

        topLeftPanel.append(optionsLeft);

        const leftPanel = new LeftPanel(this.game).create();

        left.append(topLeftPanel, leftPanel);

        const center = document.createElement('div');
        center.id = 'board-wrapper';

        const middlePanel = document.createElement('div');
        middlePanel.id = 'middle-panel';

        const boardContainer = document.createElement('div');
        boardContainer.id = 'board-container';

        const topBoard = document.createElement('div');
        topBoard.id = 'top-board';

        const gameStatus = this.gameStatus = new GameStatus(this.game).create();

        topBoard.append(gameStatus);

        this.board = new Board(this.game, { size: 5 }).create();

        const bottomBoard = new BottomBoard(this.game).create();

        boardContainer.append(this.board);
        center.append(boardContainer);

        middlePanel.append(topBoard, center, bottomBoard);

        const right = document.createElement('div');
        right.id = 'right';

        const topRightPanel = document.createElement('div');
        topRightPanel.id = 'top-right-panel';

        const optionsRight = document.createElement('div');
        optionsRight.className = 'options';

        const changeUsernameModal = new ChangeNicknameModal(this.game);

        const changeUsernameCTA = document.createElement('span');
        changeUsernameCTA.onclick = event => changeUsernameModal.open(event);
        changeUsernameCTA.textContent = '🏷️';

        const settingsCTA = document.createElement('span');
        settingsCTA.textContent = '⚙️';

        optionsRight.append(changeUsernameCTA, settingsCTA);

        topRightPanel.append(optionsRight);

        const rightPanel = new RightPanel(this.game).create();

        right.append(topRightPanel, rightPanel);

        const content = document.createElement('div');
        content.id = 'content';

        content.append(left, middlePanel, right);

        this.element.append(content);
        return this.element;
    }
}