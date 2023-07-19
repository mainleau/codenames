import Component from '../../../core/Component.js';

export default class Team extends Component {
    create() {
        const element = document.createElement('div');
        element.className = 'team';
        
        const title = document.createElement('span');
        title.className = 'title';
        title.textContent = 'Equipe bleue';

        const list = document.createElement('div');
        


        element.append(title);
        return element;
    }
}