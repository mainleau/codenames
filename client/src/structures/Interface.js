export default class Interface {
  constructor() {}

  rerender() {
    const newElement = this.render();
    this.element.replaceWith(newElement);
    this.element = newElement;
  }
}
