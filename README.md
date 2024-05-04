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

### Слой данных

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

### Слой представления

#### Класс `CatalogView`

Отображение каталога товаров. Класс отвечает за добавление на страницу карточек товаров. Класс имплементирует интерфейс IView.

Методы:

- `render(data: { items: HTMLElement[] }): HTMLElement` - добавляет (заменяет существующие) карточки товаров на страницу.

#### Класс `BasketView`

Отображение корзины. Класс отвечает за добавление карточек товаров в корзину, за отображение и управление элементами корзины.

Поля класса:

- `protected basketList: HTMLUListElement;` - элемент списка карточек товаров в корзине;
- `protected totalPrice: HTMLSpanElement;` - элемент с итоговой стоимостью;
- `protected orderBtn: HTMLButtonElement;` - кнопка оформления заказа;

Методы:

- `render(data: { items: HTMLElement[], totalCost: number }): HTMLElement` - добавляет (заменяет существующие) карточки товаров в списке на переданные в мессиве аргументе;
- `enableOrderButton(): void` - активирует кнопку оформления заказа;
- `disableOrderButton(): void` - отключает кнопку оформления заказа.

#### Класс `BasketItemView`

Отображение карточки товара в корзине. Класс отвечает за хранение и управление элементами краточки товара в корзине.

Поля класса:

- `protected itemIndex: HTMLSpanElement;` - элемент порядкового номера товара в корзине;
- `protected title: HTMLSpanElement;` - наименование товара;
- `protected price: HTMLSpanElement;` - цена товара;
- `protected removeBtn: HTMLButtonElement;` - кнопка удаления товара из корзины;
- `protected id: string | null` - id товара, относящегося к этой карточке.

Методы:

- `render(data: { product: TBasketItem, index: number }): HTMLElement` - изменяет отображаемые на карточке данные в соответствии с переданными в качестве аргумента данными товара.

#### Класс `BasketIconView`

Отображение иконки корзины. Класс отвечает за хранение и управление элементами кнопки-иконки корзины.

Поля класса:

- `protected counter: HTMLSpanElement;` - элемент счетчика числа товаров в корзине.

Методы:

- `render(data: { count: number }): HTMLElement` - изменяет отображаемое значение количества товаров в корзине на основе переданного аргумента. Возвращает HTML-элемент контейнера.

#### Класс `CardView`

Абстрактный класс для отображений карточки товара. Класс предназначен для хранения и управления элементами разметки, характерными для всех видов карточек товара.

Поля класса:

- `protected category: HTMLSpanElement;` - элемент категории товара;
- `protected title: HTMLHeadingElement;` - элемент наименования товара;
- `protected img: HTMLImageElement;` - элемент изображения товара;
- `protected price: HTMLSpanElement;` - элемент цены товара.

Методы:

- `render(data: { product: IProductModel, cdn: string }): HTMLElement` - изменяет отображаемые на карточке данные товара в соответствии с заданными аргументом. Возвращает элемент разметки карточки.

#### Класс `CardCatalogView`

Отображение карточки товара для каталога. Класс отвечает за хранение и управление элементами разметки, характерными только для карточки каталога.
Класс унаследован от `CardView`.
Поля и методы класса идантичны родительскому классу.
Отличие закличается в том, что в конструкторе данного класса устанавливается слушатель события `click` на кнопку-контейнер карточки.

#### Класс `CardFullView`

Отображение карточки товара в модельном окне. Класс отвечает за хранение и управление элементами разметки, характерными только для карточки модального окна.
Класс унаследован от `CardView`.

Поля класса:

- `protected description: HTMLParagraphElement;` - элемент описания товара;
- `protected addBasketBtn: HTMLButtonElement;` - кнопка добавления в корзину (удаления из корзины).

Методы:

- `enableAddButton()` - активирует кнопку добавления(удаления), если цена товара указана в данных;
- `disableAddButton()` - отключает кнопку добавления(удаления), если цена товара не указана в данных;
- `setStateAddButton(inBasket: boolean): void` - изменяет состояние кнопку добавления(удаления) в зависимости от наличия товара в корзине;
- `override render(data: { product: IProductModel, cdn: string, inBasket: boolean }): HTMLElement` - изменяет отображение карточки в зависимости от переданного аргумента с данными о товаре.

#### Класс `FormView`

Абстрактный класс для отображений форм. Класс предназначен для хранения и управления элементами разметки, характерными для всех видов форм.

Поля класса:

- `protected errors: HTMLSpanElement;` - элемент с сообщение об ошибке валидации;
- `protected submitBtn: HTMLButtonElement;` - кнопка отправки сабмита формы.

Методы:

- `enableSubmitButton()` - активирует кнопку сабмита;
- `disableSubmitButton()` - отключает кнопку сабмита;
- `validate(validityState: string)` - изменяет элементы формы в зависимости от статуса валидации, передаваемого аргументом;
- `render(data?: object): HTMLElement` - возвращает элемент формы;

#### Класс `FormOrderView`

Отображение формы данных заказа. Класс отвечает за хранение и управление элементами разметки, характерными только для формы данных заказа (способ оплаты и адрес доставки).
Класс унаследован от класса `FormView`.

Поля класса6

- `protected orderButtonCard: HTMLButtonElement;` - элемент кнопки выбора способа оплаты "Картой";
- `protected orderButtonCash: HTMLButtonElement;` - элемент кнопки выбора способа оплаты "При получении";
- `protected addressInput: HTMLInputElement;` - элемент ввода адреса доставки.

Методы:

- `setPaymentMethod(method: TPaymentMethod): void` - изменяет состояния кнопок выбора способа оплаты в зависимости от выбранного способа, передаваемого аргументом;
- `checkValidity(): string` - проверяет элементы формы на валидность. Возвращает статус валидации в виде строки;
- `override render(data?: { payment: TPaymentMethod, address: string }): HTMLElement` - изменяет состояние элементов формы в соответствии с передаваемыми в аргументе данными.

#### Класс `FormContactsView`

Отображение формы контактных данных. Класс отвечает за хранение и управление элементами разметки, характерными только для формы контактных данных (email, номер телефона).
Класс унаследован от класса `FormView`.

Поля класса:

- `protected emailInput: HTMLInputElement;` - элемент ввода адреса электронной почты;
- `protected phoneInput: HTMLInputElement;` - элемент ввода номера телефона.

Методы:

- `checkValidity(): string` - проверяет элементы формы на валидность. Возвращает статус валидации в виде строки;
- `override render(data?: { email: string, phone: string }): HTMLElement` - изменяет состояние элементов формы в соответствии с передаваемыми в аргументе данными.

#### Класс `ModalView`

Отображение модального окна. Класс отвечает за хранение и управление элементам иразметки модального окна.

Поля класса:

- `protected contentContainer: HTMLDivElement;` - контейнер для содержимого модального окна;
- `protected closeBtn: HTMLButtonElement;` - кнопка закрытия модального окна;

Методы:

- `render(data: HTMLElement): HTMLElement` - заменяет содержимое модального окна на элемент, передаваемый в аргументе. Возвращает элемент разметки модально окна.
- `open()` - открывает модальное окно;
- `close()` - закрывает модальное окно.

#### Класс `SuccessView`

Отображение окна успешного оформления заказа. Класс отвечает за хранение и управление элементами разметки окна успешного оформления заказа.

Поля класса:

- `protected description: HTMLParagraphElement;` - элемент описания данных об успешном оформлении заказа;
- `protected successBtn: HTMLButtonElement;` - кнопка, закрывающая окно.

Методы:

- `render(data: { total: number }): HTMLElement` - добавляет в элемент описания description информацию в соответствии с переданным аргументом. Возвращает элемент контейнера окна.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `user:change` - изменение данных пользователя
- `catalog:change` - изменение каталога товаров
- `basket:change` - изменение содержимого корзины

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `ui:catalog-item-open` - открытие модального окна с карточкой товара
- `ui:modal-closeModal` - закрытие модального окна
- `ui:cardFull-addBasket` - добавление (удаление) товара из корзины с помощью кнопки в окне карточки товара
- `ui:basketIcon-openBasket` - открытие корзины
- `ui:basket-remove-item` - удаление товара из корзины с помощью кнопки в окне корзины
- `ui:basket-order` - открытие модального окна с данными о заказн
- `ui:orderForm-paymentMethodButton` - выбор способа оплаты
- `ui:orderForm-addressInput` - ввод в поле адреса доставки
- `ui:orderForm-submit` - сабмит формы данных о заказе
- `ui:contactsForm-emailInput` - ввод в поле адреса электронной почты
- `ui:contactsForm-phoneInput` - ввод в поле номера телефона
- `ui:contactsForm-submit` - сабмит формы контактных данных
- `ui:successButton` - закрытие окна успешного оформления заказа