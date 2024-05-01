import { ICatalogModel, IProductModel } from "../types";

export class CatalogModel implements ICatalogModel {

    items: IProductModel[];

    constructor(items?: IProductModel[]) {
        if (items) this.setItems(items);
        else this.items = [];
    }

    setItems(items: IProductModel[]): void {
        this.items = items;
    }
    
    getProductById(id: string): IProductModel | null {
        const idArr = this.items.map(item => item.id);
        const searchIndex = idArr.indexOf(id);
        return searchIndex === -1 ? null : this.items[searchIndex];
    }
}