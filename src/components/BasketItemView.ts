import { IEventEmitter, IView } from "../types";

export class BasketItemView implements IView {
    //элементы контейнера
    protected itemIndex: HTMLSpanElement;
    protected title: HTMLSpanElement;
    protected price: HTMLSpanElement;
    protected removeBtn: HTMLButtonElement;

    //id товара
    protected id: string | null = null;

    constructor (protected container: HTMLElement, protected events: IEventEmitter) {
        this.itemIndex = container.querySelector('.basket__item-index') as HTMLSpanElement;
        this.title = container.querySelector('.card__title') as HTMLSpanElement;
        this.price = container.querySelector('.card__price') as HTMLSpanElement;
        this.removeBtn = container.querySelector('.basket__item-delete card__button') as HTMLButtonElement;

        this.removeBtn.addEventListener('click', () => {
            this.events.emit('ui:basket-remove-item', {id: this.id})
        })
    }

    render(data: {id: string, title: string, price: number}): HTMLElement {
        if (data) {
            this.id = data.id;
            this.title.textContent = data.title;
            this.price.textContent = `${data.price}`;
        }

        return this.container;
    }
}