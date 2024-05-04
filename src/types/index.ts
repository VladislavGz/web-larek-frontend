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

export type TBasketOrderData = {
    total: number;
    items: string[];
}

export interface IBasketModel {
    items: TBasketItems;

    get count(): number;
    get totalCost(): number;

    addProduct(item: TBasketItem): void;
    removeProduct(id: string): void;
    clear(): void;
    getItems(): TBasketItems;
    getBasketOrderData(): TBasketOrderData;
    checkProductById(id: string): boolean;
}

export type TPaymentMethod = 'cash' | 'online' | '';

export type TUserData = {
    payment: TPaymentMethod,
    address: string,
    email: string,
    phone: string,
}

export interface IUserModel {
    get paymentMethod(): TPaymentMethod;
    set paymentMethod(method: TPaymentMethod);
    get address(): string;
    set address(address: string);
    get email(): string;
    set email(email: string);
    get phone(): string;
    set phone(phone: string);
}

export type OrderData = {
    id: string,
    total: number
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