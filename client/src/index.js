import Manager from './core/Manager.js';
import AuthenticationInterface from './interfaces/authentication/index.js';
import HomeInterface from './interfaces/home/index.js';
import RegisterInterface from './interfaces/authentication/RegisterInterface.js';
import './styles.css';
import { isUUID } from './utils/index.js';
import GameInterface from './interfaces/game/index.js';

window.onload = () => new Application().launch();

// TODO: create component where admin should be able to select server dev/prod
class Application {
    launched = false;
    constructor() {
        this.name = 'Nomdecode';
        this.version = '0.0.1';
        
        this.manager = new Manager(this);
    }

    launch() {
        if(this.launched) throw new Error('APPLICATION_ALREADY_LAUNCHED');
        this.launched = true;

        this.element = document.createElement('div');
        this.element.id = 'app';
        document.body.replaceChildren(this.element);

        this.manager.init();
    }

    goAuth() {
        const ref = new URLSearchParams(location.search).get('ref');
        new AuthenticationInterface(this, ref).make();
    }

    goHome() {
        new HomeInterface(this).make();
    }
}

document.oncontextmenu = event => event.preventDefault();
