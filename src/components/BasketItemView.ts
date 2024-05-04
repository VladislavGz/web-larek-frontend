import { IEventEmitter, IView, TBasketItem } from "../types";

export class BasketItemView implements IView {
    //элементы контейнера
    protected itemIndex: HTMLSpanElement;
    protected title: HTMLSpanElement;
    protected price: HTMLSpanElement;
    protected removeBtn: HTMLButtonElement;

    //id товара
    protected id: string | null = null;

    constructor(protected container: HTMLElement, protected events: IEventEmitter) {
        this.itemIndex = this.container.querySelector('.basket__item-index') as HTMLSpanElement;
        this.title = this.container.querySelector('.card__title') as HTMLSpanElement;
        this.price = this.container.querySelector('.card__price') as HTMLSpanElement;
        this.removeBtn = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;

        this.removeBtn.addEventListener('click', () => {
            this.events.emit('ui:basket-remove-item', { id: this.id })
        })
    }

    render(data: { product: TBasketItem, index: number }): HTMLElement {
        if (data) {
            const price = data.product.price ? `${data.product.price} синапсов` : 'Бесценно';

            this.id = data.product.id;
            this.title.textContent = data.product.title;
            this.price.textContent = price;
            this.itemIndex.textContent = `${data.index}`
        }

        return this.container;
    }
}