import { IEventEmitter, IProductModel, IView } from "../types";

abstract class CardView implements IView {

    protected category: HTMLSpanElement;
    protected title: HTMLHeadingElement;
    protected img: HTMLImageElement;
    protected price: HTMLSpanElement;

    protected static categoryClassList: {
        [category: string]: string;
    } = {
        base: 'card__category',
        'софт-скил': 'card__category_soft',
        'другое': 'card__category_other',
        'дополнительное': 'card__category_additional',
        'хард-скил': 'card__category_hard',
        'кнопка': 'card__category_button'
    }

    protected id: string | null = null;

    constructor(protected container: HTMLElement, protected events: IEventEmitter) {
        this.category = this.container.querySelector('.card__category') as HTMLSpanElement;
        this.title = this.container.querySelector('.card__title') as HTMLHeadingElement;
        this.img = this.container.querySelector('.card__image') as HTMLImageElement;
        this.price = this.container.querySelector('.card__price') as HTMLSpanElement;
    }

    render(data: {product: IProductModel, cdn: string}): HTMLElement {
        if (data) {
            const price = data.product.price ? `${data.product.price}` : 'Бесценно';

            this.id = data.product.id;
            this.category.textContent = data.product.category;
            this.title.textContent = data.product.title;
            this.img.setAttribute('src', `${data.cdn}${data.product.image}`);
            this.price.textContent = price;

            this.category.className = CardView.categoryClassList.base;
            this.category.classList.add(CardView.categoryClassList[data.product.category]);
        }

        return this.container;
    }
}

export class CardCatalogView extends CardView {

    constructor(container: HTMLButtonElement, events: IEventEmitter) {
        super(container, events);

        this.container.addEventListener('click', () => {
            this.events.emit('ui:catalog-item-open', {id: this.id})
        })
    }
}

export class CardFullView extends CardView {

    protected description: HTMLParagraphElement;
    protected addBasketBtn: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEventEmitter) {
        super(container, events);

        this.description = this.container.querySelector('.card__text') as HTMLParagraphElement;
        this.addBasketBtn = this.container.querySelector('.button') as HTMLButtonElement;

        this.addBasketBtn.addEventListener('click', () => {
            this.events.emit('ui:cardFull-addBasket', {id: this.id});
        });
    }

    override render(data: {product: IProductModel, cdn: string}): HTMLElement {
        if (data) {
            super.render(data);
            this.description.textContent = data.product.description;
        }
        
        return this.container;
    }
}