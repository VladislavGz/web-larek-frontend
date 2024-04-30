type TBasketItems = { [id: string]: number }

export interface IProductModel {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IProductCatalogModel {
    items: IBasketModel[];

    setItems(items: IBasketModel[]): void;
    getProductById(id: string): IProductModel;
}

export interface IBasketModel {
    items: TBasketItems;
    totalCost: number;

    addProduct(id: string): void;
    removeProduct(id: string): void;
    clear(): void;
    getItems(): TBasketItems;
    calculateCost(): number;
}

export interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
}

export interface IViewConstructor {
    new (container: HTMLElement, events?: IEventEmitter): IView;
}

export interface IView {
    render(): HTMLElement;  
}