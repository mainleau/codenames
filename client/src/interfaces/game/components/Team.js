import Component from '../../../core/Component.js';

export default class Team extends Component {
    constructor(game, team) {
        super();
        this.game = game;
        this.team = team;
    }

    create() {
        const element = document.createElement('div');
        element.className = 'team';
        
        const title = document.createElement('span');
        title.className = 'team-title';
        title.textContent = `EQUIPE ${this.team ? 'ROUGE' : 'BLEUE'}`;

        const listContainer = document.createElement('div');
        listContainer.className = 'list-container';

        const [firstList, secondList] = [0, 1].map(role => {
            const subtitle = document.createElement('span');
            subtitle.style.cursor = 'pointer';
            subtitle.className = 'team-subtitle';
            subtitle.textContent = role ? 'ESPIONS' : 'AGENTS';
            subtitle.onclick = () => this.game.emit('change-team-role', {
                team: this.team,
                role
            });

            const list = document.createElement('div');
            list.className = 'list';

            const players = this.game.players.map(player => {
                if(player.team !== this.team || player.role !== role) return [];
                const line = document.createElement('div');

                const username = document.createElement('span');
                username.className = 'username';
                username.textContent = player.username;

                line.append(username);
                return line
            });

            list.append(subtitle, ...players);

            return list;
        });

        listContainer.append(firstList, secondList);

        element.append(title, listContainer);
        return element;
    }
}