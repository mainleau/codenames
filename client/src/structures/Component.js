export default class Component {
  constructor() {}

  rerender() {
    this.element.replaceWith(this.create());
  }
}
