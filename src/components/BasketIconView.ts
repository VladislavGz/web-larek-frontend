import { IEventEmitter, IView } from "../types";

export class BasketIconView implements IView {

    protected counter: HTMLSpanElement;

    constructor (protected container: HTMLButtonElement, protected events: IEventEmitter) {
        this.counter = this.container.querySelector('.header__basket-counter') as HTMLSpanElement;

        this.container.addEventListener('click', () => {
            this.events.emit('ui: basketIcon-openBasket', {});
        });
    }

    render(data: {count: number}): HTMLElement {
        if (data) {
            this.counter.textContent = `${data.count}`;
        }

        return this.container;
    }
}