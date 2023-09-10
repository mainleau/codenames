import GameInterface from "../interfaces/game";

export default class GameHandler {
    intf = null;
    constructor(app) {
        this.app = app;
    }

    join(id, mode) {
        const game = this.app.manager.api.games.join(id, mode);
        this.intf = new GameInterface(this.app, game);
        this.intf.make();
    }
    
    create(mode) {
        const game = this.app.manager.api.games.create(mode);
        this.intf = new GameInterface(this.app, game);
        this.intf.make();
    }
}