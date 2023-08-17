import AuthInterface from "./authentication";
import HomeInterface from "./home";
import GameInterface from "./game";

export default class InterfaceController {
    constructor(app) {
        this.auth = new AuthInterface(app);
        this.home = new HomeInterface(app);
        this.game = new GameInterface(app);
    }
}