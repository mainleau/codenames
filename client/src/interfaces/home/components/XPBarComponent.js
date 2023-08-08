import Component from '../../../structures/Component.js';

export default class XPBarComponent extends Component {
    constructor(user) {
        super();

        this.user = user;
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'xp-bar-component';

        const bar = document.createElement('div');
        bar.id = 'bar';

        const filledBar = document.createElement('div');
        filledBar.id = 'filled-bar';

        const XPTiers = [200, 350, 500, 650, 750, 850, 950, 1050, 1150, 1250,
        1350, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900];

        filledBar.style.width = 100 - (100 * this.user.XPUntilNextLevel) / (XPTiers[this.user.level - 1] || 2000) + '%';

        const details = document.createElement('span');
        details.textContent = `${this.user.xp} / ${XPTiers[this.user.level - 1] || 2000} XP`;

        bar.append(filledBar);
        this.element.append(bar, details)
        return this.element;
    }
}