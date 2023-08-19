export default class Interface {
    constructor(app) {
        this.app = app;
    }

    make() {
        const element = this.render();
        this.app.element.replaceChildren(element);
    }

    rerender() {
        this.make();
    }
}
