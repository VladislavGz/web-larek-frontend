import { IEventEmitter, IView } from "../types";

export class SuccessView implements IView {

    protected description: HTMLParagraphElement;
    protected successBtn: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEventEmitter) {
        this.description = this.container.querySelector('.order-success__description') as HTMLParagraphElement;
        this.successBtn = this.container.querySelector('.order-success__close') as HTMLButtonElement;

        this.successBtn.addEventListener('click', () => {
            this.events.emit('ui:successButton', {});
        });
    }

    render(data: { total: number }): HTMLElement {
        if (data) {
            this.description.textContent = `Списано ${data.total} синапсов`;
        }

        return this.container;
    }
}