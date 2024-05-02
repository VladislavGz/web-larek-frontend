import { IEventEmitter, IProductModel, IView } from "../types";

abstract class ModalView implements IView {

    protected closeBtn: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEventEmitter) {
        this.closeBtn = this.container.querySelector('.modal__close') as HTMLButtonElement;

        this.container.addEventListener('click', evt => {
            if (evt.target === this.container || evt.target === this.closeBtn) {
                this.events.emit('ui:modal-card-closeModel', {});
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

export class ModalViewCardFull extends ModalView {

    protected img: HTMLImageElement;
    protected category: HTMLSpanElement;
    protected title: HTMLHeadingElement;
    protected description: HTMLParagraphElement;
    protected price: HTMLSpanElement;
    protected addBasketBtn: HTMLButtonElement;

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

    constructor(container: HTMLElement, events: IEventEmitter) {
        super(container, events);

        this.img = this.container.querySelector('.card__image') as HTMLImageElement;
        this.category = this.container.querySelector('.card__category') as HTMLSpanElement;
        this.title = this.container.querySelector('.card__title') as HTMLHeadingElement;
        this.description = this.container.querySelector('.card__text') as HTMLParagraphElement;
        this.price = this.container.querySelector('.card__price') as HTMLSpanElement;
        this.addBasketBtn = this.container.querySelector('.button') as HTMLButtonElement;

        this.addBasketBtn.addEventListener('click', () => {
            this.events.emit('ui:modal-card-addBasket', {id: this.id});
        });
    }

    override render(data: {product: IProductModel, cdn: string}): HTMLElement {
        const price = data.product.price ? `${data.product.price}` : 'Бесценно';

        this.id = data.product.id;
        this.category.textContent = data.product.category;
        this.title.textContent = data.product.title;
        this.img.setAttribute('src', `${data.cdn}${data.product.image}`);
        this.price.textContent = price;

        this.category.className = ModalViewCardFull.categoryClassList.base;
        this.category.classList.add(ModalViewCardFull.categoryClassList[data.product.category]);

        return this.container;
    }
}