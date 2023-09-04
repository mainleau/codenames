import Game from './Game.js';
import { GAME_MODES, GAME_ROLES, GAME_RULES, USER_FLAGS } from '../../../utils/Constants.js';
import { getLevel, getDeltaPoints } from '../../../utils/index.js';

export default class RankedGame extends Game {
    constructor(manager) {
        super(manager);

        this.mode = GAME_MODES.RANKED_GAME;

        this.rules = GAME_RULES.RANDOM_ROLE | GAME_RULES.RANDOM_TEAM | GAME_RULES.TEAM_ROLE_LOCK
            | GAME_RULES.RESTRICTED_CLUE_WORD;
    }

    handle(player, event) {
        super.handle(player, event);
    }

    start() {
        super.start();

        const game = this.manager['RANKED_GAME'].queue.get(this.id);
        this.manager['RANKED_GAME'].queue.delete(this.id);
        this.manager['RANKED_GAME'].set(game.id, game);

        // TODO: make this according to max player count
        this.players.random(this.players.size).map((player, index) => {
            this.update(player, {
                role: index % 2 === 0 ? GAME_ROLES.OPERATIVE : GAME_ROLES.SPYMASTER,
                team: Math.floor(index / 2) === 0 ? 0 : 1,
            }, true);
        });
    }

    reward(winner) {
        const delta = this.teams.map(team => team.averagePoints);

        this.players.forEach(async player => {
            if (player.role === GAME_ROLES.SPECTATOR) return;
    
            let gainedXp = player.teamId === winner ? 120 : 40;
    
            const hasDoubleXP = player.isLogged ? player.user.flags & USER_FLAGS.EARLY_BIRD : false;
            if (hasDoubleXP) gainedXp *= 2;

            const durationInMinutes = Math.floor(this.duration / (1000 * 60));
            var deltaPoints;

            deltaPoints = getDeltaPoints(delta[player.teamId], delta[player.teamId ^ 1], +(winner === player.teamId));

            deltaPoints /= durationInMinutes < 5
                ? 8
                : durationInMinutes < 10
                ? 5
                : durationInMinutes < 20
                ? 2
                : 1;
            
            deltaPoints = Math.round(deltaPoints);
    
            if (player.isLogged) {
                const level = getLevel(player.user.xp + gainedXp);
                this.manager.client.users
                    .increment(player.id, {
                        xp: gainedXp,
                        level: level - player.user.level,
                        points: deltaPoints,
                    })
                    .catch(() => {});
                this.manager.client.users
                    .incrementStats(player.id, {
                        games_played: 1,
                        games_won: player.team === winner ? 1 : 0,
                        games_lost: player.team === winner ? 0 : 1,
                    })
                    .catch(() => {});
            }
    
            player.emit('game-rewards', {
                winner,
                xp: gainedXp,
                deltaPoints,
                points: player.user.points + deltaPoints,
            });
        });
    }

    toJSON() {
        return {
            ...super.toJSON()
        };
    }
}
