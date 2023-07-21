export default class Modal {
    constructor({ width, height }) {
        this.element = document.createElement('div');
        this.element.id = 'modal';
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;

        this.mask = document.createElement('div');
        this.mask.id = 'mask';

        this.check = event => {
            if (!this.element.contains(event.target)) this.open();
        };
    }

    open(event) {
        if(event) {
            document.body.append(this.element, this.mask);
            event.stopPropagation();
            window.addEventListener('click', this.check);
        }
        else {
            window.removeEventListener('click', this.check);
            this.element.remove();
            this.mask.remove()
        }
    }
}