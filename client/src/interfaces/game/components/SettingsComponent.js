import Component from "../../../structures/Component";

export default class SettingsComponent extends Component {
    constructor(game) {
        super();
        this.game = game;

        this.gameInterface = document.body.firstChild.firstChild;
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'settings-component';

        const mask = document.createElement('mask');
        mask.id = 'blur-mask';

        const title = document.createElement('span');
        title.className = 'title';
        title.textContent = 'Paramètres de la partie';

        const gameName = document.createElement('div');
        gameName.id = 'game-name';

        const gameNameTitle = document.createElement('span');
        gameNameTitle.textContent = 'Nom de la partie';

        const gameNameInput = this.gameNameInput = document.createElement('input');
        gameNameInput.placeholder = this.game.name;
        gameNameInput.maxLength = 12;
        gameNameInput.spellcheck = false;

        gameName.append(gameNameTitle, gameNameInput);

        const privacy = document.createElement('div');
        privacy.id = 'privacy';

        const privacyTitle = document.createElement('span');
        privacyTitle.id = 'privacy-title';
        privacyTitle.textContent = 'Partie privée';

        const privacyToggleSwitch = document.createElement('div');
        privacyToggleSwitch.className = 'toggle-switch';
        privacyToggleSwitch.style.backgroundColor = '#F67280';
        privacyToggleSwitch.onclick = () => {
            privacyToggleSwitchButton.classList.toggle('active');
            privacyToggleSwitch.style.backgroundColor =
                privacyToggleSwitchButton.classList.contains('active') ? 'palegreen'
                : '#F67280';
        }

        const privacyToggleSwitchButton = document.createElement('div');

        privacyToggleSwitch.append(privacyToggleSwitchButton);

        privacy.append(privacyTitle, privacyToggleSwitch);

        const confirmCTA = document.createElement('div');
        confirmCTA.className = 'cta';
        confirmCTA.onclick = () => {
            this.game.socket.emit('update-settings', {
                name: gameNameInput.value || this.game.name,
                privacy: !!privacyToggleSwitchButton.classList.contains('active')
            });
            this.element.remove();
            mask.remove();
        }

        const confirmCTAText = document.createElement('span');
        confirmCTAText.textContent = 'Confirmer';

        confirmCTA.append(confirmCTAText);
        
        this.element.append(title, gameName, privacy, confirmCTA);
        this.gameInterface.append(mask);
        return this.element;
    }
}