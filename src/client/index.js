import GameInterface from './interfaces/game/index.js';

window.onload = () => {
    const app = document.createElement('div');
    app.id = 'app';

    new GameInterface(app);

    document.body.appendChild(app);
}