import { IBasketModel, IEventEmitter, TBasketItem, TBasketItems, TBasketOrderData } from "../types";

export class BasketModel implements IBasketModel {
    items: TBasketItems;

    constructor(protected events: IEventEmitter) {
        this.items = {};
    }

    get count() {
        return Object.keys(this.items).length;
    }

    get totalCost() {
        let cost = 0;
        for (let id in this.items) {
            cost += this.items[id].price;
        }

        return cost;
    }

    addProduct(item: TBasketItem): void {
        if (this.items[item.id]) return;

        this.items[item.id] = item;
        this._changed();
    }

    removeProduct(id: string): void {
        delete this.items[id];
        this._changed();
    }

    clear(): void {
        this.items = {};
        this._changed();
    }

    getItems(): TBasketItems {
        return this.items;
    }

    getBasketOrderData(): TBasketOrderData {
        return {
            total: this.totalCost,
            items: Object.keys(this.items)
        }
    }

    checkProductById(id: string): boolean {
        return !!this.items[id];
    }

    protected _changed() {
        this.events.emit('basket:change', this.getItems());
    }
}