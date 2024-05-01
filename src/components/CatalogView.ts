import { IEventEmitter, IView } from "../types";

export class CatalogView implements IView {

    constructor (protected container: HTMLElement, protected events: IEventEmitter) {

    }

    
}