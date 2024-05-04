# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

### Карточка товара

```
export interface IProductModel {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```

### Каталог товаров

```
export interface ICatalogModel {
    items: IProductModel[];

    setItems(items: IProductModel[]): void;
    getProductById(id: string): IProductModel | null;
}
```

### Данные товара для корзины

```
export type TBasketItem = Pick<IProductModel, 'id' | 'title' | 'price'>;
```

### Список товаров в корзине

```
export type TBasketItems = {
    [id: string]: TBasketItem
}
```

### Данные о товарах в корзине, необходимые для оформления заказа

```
export type TBasketOrderData = {
    total: number;
    items: string[];
}
```

### Модель корзины

```
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
```

### Тип способа оплаты заказа

```
export type TPaymentMethod = 'cash' | 'online' | '';
```

### Данные пользователя

```
export type TUserData = {
    payment: TPaymentMethod,
    address: string,
    email: string,
    phone: string,
}
```

### Модель пользователя

```
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
```

### Данные о заказе, принимаемые с сервера

```
export type OrderData = {
    id: string,
    total: number
}
```

### Брокер событий

```
export interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
    }
```

### Конструктор отображений

```
export interface IViewConstructor {
    new(container: HTMLElement, events?: IEventEmitter): IView;
}
```

### Отображения

```
export interface IView {
    render(data?: object): HTMLElement;
}
```
