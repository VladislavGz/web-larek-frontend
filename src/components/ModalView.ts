import { IEventEmitter, IView } from "../types";

export class ModalView implements IView {

    protected closeBtn: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEventEmitter) {
        this.closeBtn = this.container.querySelector('.modal__close') as HTMLButtonElement;

        this.container.addEventListener('click', evt => {
            if (evt.target === this.container || evt.target === this.closeBtn) {
                this.events.emit('ui:modal-closeModal', {});
                return;
            }
        });
    }

    render(data?: object): HTMLElement {
        return this.container;
    }

    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
    }
}