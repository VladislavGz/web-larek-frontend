import { electron } from "webpack";
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

        this.disableOrderButton();
    }

    enableOrderButton(): void {
        this.orderBtn.removeAttribute('disabled');
    }

    disableOrderButton(): void {
        this.orderBtn.setAttribute('disabled', '');
    }

    render(data: { items: HTMLElement[], totalCost: number }): HTMLElement {
        if (data) {
            this.basketList.replaceChildren(...data.items);
            this.totalPrice.textContent = `${data.totalCost} синапсов`;

            if (data.items.length > 0) { this.enableOrderButton() }
            else { this.disableOrderButton() }
        }

        return this.container;
    }
}