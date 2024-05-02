import { IEventEmitter, IView } from "../types";

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
}