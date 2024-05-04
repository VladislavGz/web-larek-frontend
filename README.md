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

Карточка товара

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

Каталог товаров

```
export interface ICatalogModel {
    items: IProductModel[];

    setItems(items: IProductModel[]): void;
    getProductById(id: string): IProductModel | null;
}
```

Данные товара для корзины

```
export type TBasketItem = Pick<IProductModel, 'id' | 'title' | 'price'>;
```

Список товаров в корзине

```
export type TBasketItems = {
    [id: string]: TBasketItem
}
```

Данные о товарах в корзине, необходимые для оформления заказа

```
export type TBasketOrderData = {
    total: number;
    items: string[];
}
```

Модель корзины

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

Тип способа оплаты заказа

```
export type TPaymentMethod = 'cash' | 'online' | '';
```

Данные пользователя

```
export type TUserData = {
    payment: TPaymentMethod,
    address: string,
    email: string,
    phone: string,
}
```

Модель пользователя

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

Данные о заказе, принимаемые с сервера

```
export type OrderData = {
    id: string,
    total: number
}
```

Брокер событий

```
export interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
    }
```

Конструктор отображений

```
export interface IViewConstructor {
    new(container: HTMLElement, events?: IEventEmitter): IView;
}
```

Отображения

```
export interface IView {
    render(data?: object): HTMLElement;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс `Api`

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер;
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс `EventEmitter`

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - установить обработчик события;
- `off` - снять обработчик события;
- `emit` - инициализация события;
- `onAll` - установить обработчик для всех событий;
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

#### Класс `CatalogModel`
Модель каталога товаров. Класс отвечает за хранение и обработку данных о товарах.
Конструктор принимает экземпляр брокера событий.

Поля класса:
- `items: IProductModel[];` - массив объектов данных о товарах.

Методы:
- `setItems(items: IProductModel[]): void` - устанавливает массив данных о товарах;
- `getProductById(id: string): IProductModel | null` - возвращает объект данных конкретного товара по id этого товара.

#### Класс `BasketModel`
Модель корзины. Класс отвечает за хранение и обработку данных о товарах, находящихся в корзине, а также за добавление и удаление товаров в корзину/из корзины.

Поля класса:
- `items: TBasketItems;` - хранит объекты товаров, добавленных в корзину.

Методы:
- `get count()` - возвращает количество товаров в корзине;
- `get totalCost()` - возвращает суммарную стоимость всех товаров в корзине;
- `addProduct(item: TBasketItem): void` - добавляет товар в корзину;
- `removeProduct(id: string): void` - удаляет товар из корзины по id этого товара;
- `clear(): void` - удаляет все товары из корзины;
- `getItems(): TBasketItems` - возвращает список товаров в корзине;
- `getBasketOrderData(): TBasketOrderData` - возвращает объект с данными о товарах в корзине, предназначенный для передачи на сервер;
- `checkProductById(id: string): boolean` - возвращает true, если товар с указанным id уже добавлен а корзину.

#### Класс `UserModel`
Модель пользователя. Класс отвечает за хранение и изменение данных о пользователе.

Поля класса:
- `private _paymentMethod: TPaymentMethod;` - способ олаты заказа;
- `private _address: string;` - адрес доставки;
- `private _email: string;` - адрес электронной почты;
- `private _phone: string;` - номер телефона;

Методы:
- `get paymentMethod(): TPaymentMethod` - возвращает способ оплаты;
- `set paymentMethod(method: TPaymentMethod)` - задает способ оплаты;
- `get address(): string` - возвращает адрес доставки;
- `set address(address: string)` - задает адрес доставки;
- `get email(): string` - возвращает адрес электронной почты;
- `set email(email: string)` - задает адрес электронной почты;
- `get phone(): string` - возвращает номер телефона;
- `set phone(phone: string)` - задает номер телефона;
- `getUserData = (): TUserData` - возвращает объект со всеми данными пользователя;