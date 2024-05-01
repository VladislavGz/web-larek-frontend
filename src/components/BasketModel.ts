import { IBasketModel, IEventEmitter, TBasketItem, TBasketItems } from "../types";

export class BasketModel implements IBasketModel {
    items: TBasketItems;
    totalCost: number;

    constructor(protected events: IEventEmitter) {
        this.items = {};
    }

    addProduct(id: string, item: TBasketItem): void {
        this.items[id] = item;
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

    calculateCost(): number {
        let cost = 0;
        for (let id in this.items) {
            cost += this.items[id].count * this.items[id].price;
        }

        return cost;
    }

    protected _changed() {
        this.events.emit('basket:change', this.getItems());
    }
}