import { IEventEmitter, IView } from "../types";

export class CatalogView implements IView {

    constructor(protected container: HTMLElement, protected events: IEventEmitter) {

    }

    render(data: { items: HTMLElement[] }): HTMLElement {
        if (data) {
            this.container.replaceChildren(...data.items);
        }

        return this.container;
    }
}