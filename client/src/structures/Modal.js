export default class Modal {
    constructor({ width, height }) {
        this.width = width;
        this.height = height;

        this.mask = document.createElement('div');
        this.mask.id = 'mask';

        this.check = event => {
            if (!this.element.contains(event.target)) this.close();
        };
    }

    close() {
        window.removeEventListener('click', this.check);
        this.element.remove();
        this.mask.remove()
    }

    open(event) {
        this.element = document.createElement('div');
        this.element.className = 'modal';
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        document.body.append(this.element, this.mask);
        event.stopPropagation();
        window.addEventListener('click', this.check);
    }
}