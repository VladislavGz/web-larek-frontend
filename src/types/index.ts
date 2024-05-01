export type TBasketItem = {
    title: string,
    count: number,
    price: number
}

export type TBasketItems = {
    [id: string]: TBasketItem
}

export interface IProductModel {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IProductCatalogModel {
    items: IProductModel[];

    setItems(items: IProductModel[]): void;
    getProductById(id: string): IProductModel | null;
}

export interface IBasketModel {
    items: TBasketItems;
    totalCost: number;

    addProduct(id: string, item: TBasketItem): void;
    removeProduct(id: string): void;
    clear(): void;
    getItems(): TBasketItems;
    calculateCost(): number;
}

export interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
}

export interface IViewConstructor {
    new(container: HTMLElement, events?: IEventEmitter): IView;
}

export interface IView {
    render(): HTMLElement;
}