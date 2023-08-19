import GameInterface from "../interfaces/game";

export default class GameHandler {
    constructor(app) {
        this.app = app;
    }

    join(id, mode) {
        const game = this.app.manager.api.games.join(id, mode);
        new GameInterface(this.app, game).make();
    }
    
    create(mode) {
        const game = this.app.manager.api.games.create(mode);
        new GameInterface(this.app, game).make();
    }
}