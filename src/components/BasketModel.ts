import { IBasketModel, TBasketItem, TBasketItems } from "../types";

export class BasketModel implements IBasketModel {
    items: TBasketItems;
    totalCost: number;

    constructor() {
        this.items = {};
    }

    addProduct(id: string, item: TBasketItem): void {
        this.items[id] = item;
    }

    removeProduct(id: string): void {
        delete this.items[id];
    }

    clear(): void {
        this.items = {};
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
}