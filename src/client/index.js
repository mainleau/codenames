import GameInterface from './interfaces/game/index.js';
import HomeInterface from './interfaces/home/index.js';
import { isUUID } from './util/index.js';

window.onload = () => {
    const app = document.createElement('div');
    app.id = 'app';

    var url = `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.hostname}:8888`;
    const socket = new WebSocket(url);
    
    const id = location.pathname.substring(1);

    if(isUUID(id)) {
        new GameInterface(app, socket, id);
    } else {
        new HomeInterface(app, socket);
    }

    document.body.appendChild(app);
}

document.oncontextmenu = e => e.preventDefault();