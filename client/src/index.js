import GameInterface from './interfaces/game/index.js';
import HomeInterface from './interfaces/home/index.js';
import { isUUID } from './util/index.js';

window.onload = () => {
    const app = document.createElement('div');
    app.id = 'app';
    
    const id = location.pathname.substring(1);

    if(isUUID(id)) {
        new GameInterface(app, id);
    } else {
        const home = new HomeInterface(app);
        app.appendChild(home.render());
    }

    document.body.appendChild(app);
}

document.oncontextmenu = e => e.preventDefault();