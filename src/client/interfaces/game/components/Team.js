import Component from '../../../core/Component.js';

export default class Team extends Component {
    constructor(game, team) {
        super();
        this.team = team;
        this.game = game;
    }

    create() {
        const element = document.createElement('div');
        element.className = 'team';
        
        const title = document.createElement('span');
        title.className = 'team-title';
        title.textContent = `Equipe ${this.team ? 'rouge' : 'bleue'}`;

        const list = document.createElement('div');
        list.className = 'list';
        const players = this.game.players.map(player => {
            if(player.team !== this.team) return [];
            const line = document.createElement('div');

            const id = document.createElement('span');
            id.textContent = player.id;

            line.append(id);
            return line
        });

        list.append(...players);

        const joinCTA = document.createElement('span');
        joinCTA.className = 'join-cta';
        joinCTA.textContent = "Rejoindre l'équipe";
        joinCTA.onclick = () => this.game.emit('change-team', { team: this.team });
        
        element.append(title, list, joinCTA);
        return element;
    }
}