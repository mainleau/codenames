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

    rerender() {
        this.element.replaceWith(this.render(null, true));
    }

    open(event) {
        this.render(event);
    }

    close() {
        window.removeEventListener('click', this.check);
        this.element.remove();
        this.mask.remove();
    }

    render(event, rerender = false) {
        this.element = document.createElement('div');
        this.element.className = 'modal';
        if(this.width) this.element.style.width = `${this.width}px`;
        if(this.height) this.element.style.height = `${this.height}px`;

        if(!rerender) document.body.append(this.element, this.mask);
        if(event) event.stopPropagation();
        window.addEventListener('click', this.check);
    }
}
