import { IEventEmitter, IView } from "../types";

export class CatalogItem implements IView {

    constructor (protected container: HTMLElement, protected events: IEventEmitter) {

    }
}