import Modal from "../../../structures/Modal";

export default class AlertModal extends Modal {
    constructor(title, message) {
        super({
            width: 400,
        });
        this.title = title;
        this.message = message;
    }

    open() {
        super.open();

        this.element.id = 'alert-modal';

        const title = document.createElement('span');
        title.textContent = this.title;

        const message = document.createElement('span');
        message.textContent = this.message;

        this.element.append(title, message);
    }
}