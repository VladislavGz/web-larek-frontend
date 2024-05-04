//Карточка товара
export interface IProductModel {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

//Каталог товаров
export interface ICatalogModel {
    items: IProductModel[];

    setItems(items: IProductModel[]): void;
    getProductById(id: string): IProductModel | null;
}

//Данные товара для корзины
export type TBasketItem = Pick<IProductModel, 'id' | 'title' | 'price'>;

//Список товаров в корзине
export type TBasketItems = {
    [id: string]: TBasketItem
}

//Данные о товарах в корзине, необходимые для оформления заказа
export type TBasketOrderData = {
    total: number;
    items: string[];
}

//Модель корзины
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

//Тип способа оплаты заказа
export type TPaymentMethod = 'cash' | 'online' | '';

//Данные пользователя
export type TUserData = {
    payment: TPaymentMethod,
    address: string,
    email: string,
    phone: string,
}

//Модель пользователя
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

//Данные о заказе, принимаемые с сервера
export type OrderData = {
    id: string,
    total: number
}

//Брокер событий
export interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
}

//Конструктор отображений
export interface IViewConstructor {
    new(container: HTMLElement, events?: IEventEmitter): IView;
}

//Отображения
export interface IView {
    render(data?: object): HTMLElement;
}