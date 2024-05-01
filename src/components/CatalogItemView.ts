import { IEventEmitter, IView } from "../types";

export class CatalogItemView implements IView {

    constructor (protected container: HTMLElement, protected events: IEventEmitter) {

    }
}