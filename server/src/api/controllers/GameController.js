export default class GameController {
  constructor(client) {
    this.client = client;
  }

  async fetch(req, res, next) {
    const { count } = req.params;

    let games;
    try {
      games = await this.client.games.fetch({ count });
      games = games.map(game => ({ id: game.id, playerCountByTeam: game.player_count_by_team }));
    } catch (error) {
      return next(error);
    }

    return res.send(games);
  }
}
