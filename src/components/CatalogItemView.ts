import { IEventEmitter, IView } from "../types";

export class CatalogItemView implements IView {

    protected category: HTMLSpanElement;
    protected title: HTMLHeadingElement;
    protected img: HTMLImageElement;
    protected price: HTMLSpanElement;

    protected id: string | null = null;

    constructor(protected container: HTMLButtonElement, protected events: IEventEmitter) {
        this.category = this.container.querySelector('.card__category') as HTMLSpanElement;
        this.title = this.container.querySelector('.card__title') as HTMLHeadingElement;
        this.img = this.container.querySelector('.card__image') as HTMLImageElement;
        this.price = this.container.querySelector('.card__price') as HTMLSpanElement;

        this.container.addEventListener('click', () => {
            this.events.emit('ui:catalog-item-open', {id: this.id})
        })
    }

    render(data: {id: string}): HTMLElement {
        if (data) {
            this.id = data.id;
        }

        return this.container;
    }
}