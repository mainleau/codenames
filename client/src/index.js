import GameInterface from './interfaces/game/index.js';
import HomeInterface from './interfaces/home/index.js';
import Manager from './managers/Manager.js';
import { isUUID } from './util/index.js';

document.oncontextmenu = e => e.preventDefault();

window.onload = () => new Application().launch();

class Application {
    constructor() {
        this.manager = new Manager();
    }

    launch() {
        const element = document.createElement('div');
        element.id = 'app';
        document.body.appendChild(element);
        
        const path = location.pathname.substring(1);
    
        if(isUUID(path)) {
            this.manager.games.join(path);
        } else {
            const home = new HomeInterface(this.manager);
            element.appendChild(home.render());
        }
    }
}