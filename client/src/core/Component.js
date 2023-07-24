export default class Component {
    constructor() {}

    rerender() {
        const parent = this.element.parentElement;
        parent.replaceChild(this.create(), this.element);
    };
} 