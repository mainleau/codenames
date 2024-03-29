import User from '../../../api/core/structures/User.js';
import Component from '../../../structures/Component.js';
import UsernameComponent from '../../home/components/UsernameComponent.js';

export default class Team extends Component {
    constructor(game, team) {
        super();
        this.game = game;
        this.team = team;

        this.game.socket.on('player-joined', data => {
            this.game.add(data);
            this.rerender();
        });

        this.game.socket.on('player-list', data => {
            this.game.add(data);
            this.rerender();
        });

        this.game.socket.on('player-leaved', data => {
            this.game.add(data);
            this.rerender();
        });

        this.game.socket.on('player-updated', data => {
            const player = this.game.players.get(data.id);

            if(player.id === this.game.player.id) {
                this.game.selectedCards = [];
            }
            
            // If(player.id === this.playerId) {
            //     if(data.role === 0) {
            //         this.words.forEach((word, index) => {
            //             if(!this.reversedCards.has(index)) delete word.team;
            //         });
            //     }
            //     this.team = data.team;
            //     this.role = data.role
            //     this.selectedCards.clear();
            // }
            player.role = data.role;
            player.team = data.team;
            player.nickname = data.nickname;
            // Player.nickname = data.nickname;
            this.rerender();
        });
    }

    create() {
        this.element = document.createElement('div');
        this.element.className = 'team';

        const listContainer = document.createElement('div');
        listContainer.className = 'list-container';

        const [firstList, secondList] = [0, 1].map(role => {
            const subtitle = document.createElement('span');
            subtitle.style.cursor = 'pointer';
            subtitle.className = 'team-subtitle';
            subtitle.textContent = role ? 'ESPIONS' : 'AGENTS';
            subtitle.onclick = () =>
                this.game.emit('update-player', {
                    team: this.team,
                    role,
                });

            const list = document.createElement('div');
            list.className = 'list';

            const players = this.game.players.map(player => {
                if (player.team !== this.team || player.role !== role) return [];
                const line = document.createElement('div');

                const user = new User(this.game.manager.api, player);

                const username = new UsernameComponent(user, !!player.level, player.nickname, user.id === this.game.player.id, this.game.manager.api).create();
                line.append(username);
                return line;
            });

            list.append(subtitle, ...players);

            return list;
        });

        listContainer.append(firstList, secondList);

        this.element.append(listContainer);
        return this.element;
    }
}
