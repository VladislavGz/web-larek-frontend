import { IEventEmitter, IProductModel, IView } from "../types";

export class CatalogItemView implements IView {

    protected category: HTMLSpanElement;
    protected title: HTMLHeadingElement;
    protected img: HTMLImageElement;
    protected price: HTMLSpanElement;

    protected id: string | null = null;

    private static categoryClassList: {
        [category: string]: string;
    } = {
        base: 'card__category',
        'софт-скил': 'card__category_soft',
        'другое': 'card__category_other',
        'дополнительное': 'card__category_additional',
        'хард-скил': 'card__category_hard',
        'кнопка': 'card__category_button'
    }

    constructor(protected container: HTMLButtonElement, protected events: IEventEmitter) {
        this.category = this.container.querySelector('.card__category') as HTMLSpanElement;
        this.title = this.container.querySelector('.card__title') as HTMLHeadingElement;
        this.img = this.container.querySelector('.card__image') as HTMLImageElement;
        this.price = this.container.querySelector('.card__price') as HTMLSpanElement;

        this.container.addEventListener('click', () => {
            this.events.emit('ui:catalog-item-open', {id: this.id})
        })
    }

    render(data: {product: IProductModel, cdn: string}): HTMLElement {
        if (data) {
            const price = data.product.price ? `${data.product.price}` : 'Бесценно';

            this.id = data.product.id;
            this.category.textContent = data.product.category;
            this.title.textContent = data.product.title;
            this.img.setAttribute('src', `${data.cdn}${data.product.image}`);
            this.price.textContent = price;

            this.category.className = CatalogItemView.categoryClassList.base;
            this.category.classList.add(CatalogItemView.categoryClassList[data.product.category]);
        }

        return this.container;
    }
}