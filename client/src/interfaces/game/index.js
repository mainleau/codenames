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

        this.game.socket.on('word-list', data => {
            this.game.words.add(data);
        });

        this.game.socket.on('game-rewards', data => {
            const endComponent = new EndComponent(this.game, this.app, data).create();
            this.element.appendChild(endComponent);
        });

        this.game.socket.on('game-starting', data => {
            this.game.state = data.state;
        });

        this.game.socket.on('game-joined', data => {
            this.game.teamStarted = data.teamStarted
            this.game.id = data.id;
            this.game.socket.io.opts.query = `action=join-game&id=${data.id}&mode=${data.mode}`;
            this.game.state = data.state;
            this.game.rules = data.rules;
            this.game.settings = data.settings;
            this.game.turn = data.turn;
            this.game.hostId = data.hostId
            if(!this.game.players.get(data.player.id)) {
                this.game.players.set(data.player.id, data.player);
            }
            this.game.playerId = data.player.id;
            this.game.name = data.name || `Partie ${data.id.slice(0, 3)}`;
            if(!data.name && data.hostId === data.player.id) {
                if(document.body.contains(this.settings)) return;
                this.settings = new SettingsComponent(this.game, data).create();
                this.app.element.append(this.settings);
            }
        });

        this.game.socket.on('clue-forwarded', data => {
            this.game.teams[this.game.turn.team].clues.set(
                this.game.teams[this.game.turn.team].size,
                {
                    word: data.word,
                    count: data.count,
                    relatedWords: data.relatedWords,
                },
            );
            this.game.turn.role ^= true;
        });

        this.game.socket.on('card-selected', data => {
            this.game.words.get(data.word).selected = data.selected;
        });

        this.game.socket.on('card-revealed', data => {
            const word = this.game.words.get(data.word);
            word.revealed = true;
            word.team = data.team;
            this.game.clueRemainder = data.clueRemainder;
        });

        this.game.socket.on('game-started', data => {
            this.game.turn = data.turn;
            this.game.state = 1;
            this.game.teamStarted = data.turn.team;
        });

        this.game.socket.on('error', (data) => {
            if(data.message === 'GAME_NOT_FOUND') {
                this.app.goHome();
                this.app.alert('Partie introuvable', "Cette partie n'existe pas ou n'est plus disponible.");
            } else if(data.message === 'INVALID_NICKNAME') {
                this.app.alert('Surnom invalide', 'Un surnom doit contenir entre 1 et 16 caractères.');
            } else if(data.message === 'ACCOUNT_REQUIRED') {
                this.app.alert('Compte requis', 'Un compte est requis pour jouer dans ce mode.');
            } else {
                this.app.alert('Erreur sécifique', data.message);
            }
        });

        window.addEventListener('resize', () => {
            if(!document.body.contains(this.element)) return;
            this.rerender();
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

        if(this.app.type === 'mobile') {
            const bottomPanel = document.createElement('div');
            bottomPanel.id = 'bottom-panel';
            bottomPanel.append(left, right);
            topBoard.remove();

            const topBar = document.createElement('div');
            topBar.id = 'top-bar';
            topBar.append(topLeftPanel, gameStatus, topRightPanel);

            content.append(topBar, middlePanel, bottomPanel);
        } else {
            content.append(left, middlePanel, right);
        }

        this.element.append(content);
        return this.element;
    }
}