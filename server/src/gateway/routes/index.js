import express from 'express';

export default manager => {
  const router = express.Router();

  router.get('/list/public', (_, res) => {
    const games = manager.games.filter(game => !game.started && !game.ended && !game.privacy);
    res.send(games);
  });

  router.get('/list/friends', async (req, res) => {
    const friends = await manager.client.friendships.fetchByUserId(req.id);
    const games = friends.map(friend => {
      const game = manager.games.find(game => game.players.has(friend.id));
      friend.currentGameId = game ? game.id : null;
      return friend;
    });

    res.send(games);
  });

  return router;
};
