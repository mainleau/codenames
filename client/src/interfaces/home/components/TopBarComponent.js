import Component from '../../../structures/Component.js';
import SettingsModal from '../modals/SettingsModal.js';

export default class TopBarComponent extends Component {
    constructor(app) {
        super();

        this.app = app;
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'top-bar';

        const options = document.createElement('div');
        options.id = 'options';

        const settingsButton = document.createElement('div');
        settingsButton.id = 'login-button';
        settingsButton.onclick = () => {
            new SettingsModal(this.app).open();
        };

        const settingsButtonText = document.createElement('span');
        settingsButtonText.textContent = '⚙️';

        settingsButton.appendChild(settingsButtonText);

        options.appendChild(settingsButton);

        this.element.append(options);
        return this.element;
    }
}