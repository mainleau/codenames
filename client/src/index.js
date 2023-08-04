import AuthenticationInterface from './interfaces/authentication/index.js';
import HomeInterface from './interfaces/home/index.js';
import Manager from './core/Manager.js';
import { isUUID } from './utils/index.js';
import './styles.css';

window.onload = () => new Application().launch();

class Application {
    constructor() {
        this.manager = new Manager(this);
    }
    
    launch() {
        const element = this.element = document.createElement('div');
        element.id = 'app';
        document.body.replaceChildren(element);
        
        const path = location.pathname.substring(1);

        const ref = new URLSearchParams(location.search).get('ref');
        
        if(isUUID(path)) {
            this.manager.games.join(path);
        } else if(localStorage.token) {
            this.goHome();
        } else if (isUUID(ref)) {
            this.goAuth(true);
        } else {
            this.goAuth();
        }
    }

    goAuth(ref = false) {
        const authentication = new AuthenticationInterface(this.manager, ref).render();
        this.element.replaceChildren(authentication);
    }

    goHome() {
        const home = new HomeInterface(this.manager).render();
        this.element.replaceChildren(home);
    }
}

document.oncontextmenu = event => event.preventDefault();