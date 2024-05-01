import { IEventEmitter, IView } from "../types";

export class BasketView implements IView {

    protected basketList: HTMLUListElement;
    protected totalPrice: HTMLSpanElement;
    protected orderBtn: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEventEmitter) {
        this.basketList = container.querySelector('.basket__list') as HTMLUListElement;
        this.totalPrice = container.querySelector('.basket__price') as HTMLSpanElement;
        this.orderBtn = container.querySelector('.basket__button') as HTMLButtonElement;

        this.orderBtn.addEventListener('click', () => {
            this.events.emit('ui:basket-order', {});
        });
    }

    render(data: { items: HTMLElement[] }): HTMLElement {
        if (data) {
            this.container.replaceChildren(...data.items);
        }

        return this.container;
    }
}