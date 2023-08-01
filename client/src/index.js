import AuthenticationInterface from './interfaces/authentication/index.js';
import HomeInterface from './interfaces/home/index.js';
import Manager from './managers/Manager.js';
import { isUUID } from './util/index.js';

document.oncontextmenu = e => e.preventDefault();

window.onload = () => new Application().launch();

class Application {
    constructor() {
        this.manager = new Manager(this);
    }

    goHome() {
        const home = new HomeInterface(this.manager).render();
        this.element.replaceChildren(home);
    }

    launch() {
        const element = this.element = document.createElement('div');
        element.id = 'app';
        document.body.replaceChildren(element);
        
        const path = location.pathname.substring(1);
    
        if(isUUID(path)) {
            this.manager.games.join(path);
        } else if(localStorage.token) {
            const home = new HomeInterface(this.manager);
            element.appendChild(home.render());
        } else {
            const authentication = new AuthenticationInterface(this.manager);
            element.appendChild(authentication.render());
        }
    }
}