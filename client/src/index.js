import GameInterface from './interfaces/game/index.js';
import HomeInterface from './interfaces/home/index.js';
import Manager from './managers/Manager.js';
import { isUUID } from './util/index.js';

document.oncontextmenu = e => e.preventDefault();

window.onload = () => new App().launch();

class App {
    constructor() {
        this.manager = new Manager();
    }

    launch() {
        const element = document.createElement('div');
        element.id = 'app';
        
        const id = location.pathname.substring(1);
    
        if(isUUID(id)) {
            new GameInterface(element, this.manager, id);
        } else {
            const home = new HomeInterface(element, this.manager);
            app.appendChild(home.render());
        }
    
        document.body.appendChild(element);
    }
}