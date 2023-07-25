export default class Component {
    constructor() {}

    rerender() {
        const newElement = this.create();
        this.element.replaceWith(newElement);
        this.element = newElement;
    };
} 