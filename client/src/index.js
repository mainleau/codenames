import Manager from './core/Manager.js';
import AuthenticationInterface from './interfaces/authentication/index.js';
import HomeInterface from './interfaces/home/index.js';
import AlertModal from './interfaces/home/modals/AlertModal.js';
import './styles.css';

if(location.hostname !== 'localhost') {
    document.body.style.overflow = 'hidden';
}

window.onload = () => new Application().launch();

// TODO: create component where admin should be able to select server dev/prod
class Application {
    launched = false;
    constructor() {
        this.name = 'Nomdecode';
        this.version = '0.0.1';
        
        this.manager = new Manager(this);
    }

    set type(value) {
        return this.element.className = value;
    }

    get type() {
        return this.element.classList.contains('mobile') ? 'mobile' : 'desktop';
    }

    launch() {
        if(this.launched) throw new Error('APPLICATION_ALREADY_LAUNCHED');
        this.launched = true;

        this.element = document.createElement('div');
        this.element.id = 'app';
        document.body.replaceChildren(this.element);
        
        this.type = window.innerWidth < 600 ? 'mobile' : 'desktop';
        window.onresize = () => {
            const type = this.type;
            const newType = window.innerWidth < 600 ? 'mobile' : 'desktop';
            if(type === newType) return;

            this.type = newType;

            this.manager.games.intf.game.gateway.emit('change-window-type');
        }

        this.manager.init();
    }

    goAuth() {
        const ref = new URLSearchParams(location.search).get('ref');
        new AuthenticationInterface(this, ref).make();
    }

    goHome() {
        new HomeInterface(this).make();
    }

    alert(title, message) {
        new AlertModal(title, message).open();
    }
}

document.oncontextmenu = event => event.preventDefault();
