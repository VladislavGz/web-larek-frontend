export interface IProductModel {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface ICatalogModel {
    items: IProductModel[];

    setItems(items: IProductModel[]): void;
    getProductById(id: string): IProductModel | null;
}

export type TBasketItem = Pick<IProductModel, 'id' | 'title' | 'price'>;

export type TBasketItems = {
    [id: string]: TBasketItem
}

export interface IBasketModel {
    items: TBasketItems;
    totalCost: number;

    addProduct(item: TBasketItem): void;
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
    render(data?: object): HTMLElement;
}