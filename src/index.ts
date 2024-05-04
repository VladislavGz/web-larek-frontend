import { BasketIconView } from './components/BasketIconView';
import { BasketItemView } from './components/BasketItemView';
import { BasketModel } from './components/BasketModel';
import { BasketView } from './components/BasketView';
import { CardCatalogView, CardFullView } from './components/CardView';
import { CatalogModel } from './components/CatalogModel';
import { CatalogView } from './components/CatalogView';
import { FormContactsView, FormOrderView } from './components/FormView';
import { ModalView } from './components/ModalView';
import { SuccessView } from './components/SuccessView';
import { UserModel } from './components/UserModel';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IProductModel, OrderData, TBasketItem, TBasketItems, TPaymentMethod, TUserData, } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

/*------------------------------------------------------------------------------------------------------------------------------------*/
/*ИНИЦИАЛИЗАЦИЯ*/
//шаблоны
const catalogItemTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardFullTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

//базовые компоненты
const api = new Api(API_URL);
const events = new EventEmitter();

//модели
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const userModel = new UserModel(events);

//отображения
const catalog = new CatalogView(document.querySelector('.gallery'), events);
const modal = new ModalView(document.querySelector('#modal-container'), events);
const cardFull = new CardFullView(cloneTemplate(cardFullTemplate), events);
const basketIcon = new BasketIconView(document.querySelector('.header__basket'), events);
const basket = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new FormOrderView(cloneTemplate(orderTemplate), events);
const contactsForm = new FormContactsView(cloneTemplate(contactsTemplate), events);
const success = new SuccessView(cloneTemplate(successTemplate), events);

/*------------------------------------------------------------------------------------------------------------------------------------*/
/*ОБРАБОТЧИКИ СОБЫТИЙ*/
//обработка изменения модели каталога товаров
function handleCatalogChange(data: { items: IProductModel[] }) {
    let itemsContainers = data.items.map(item => {
        return new CardCatalogView(cloneTemplate(catalogItemTemplate), events).render({ product: item, cdn: CDN_URL });
    })

    catalog.render({ items: itemsContainers });
}

//обработка клика на карточку товара в каталоге
function handleCatalogItemOpen(data: { id: string }) {
    const cardContainer = cardFull.render({ product: catalogModel.getProductById(data.id), cdn: CDN_URL, inBasket: basketModel.checkProductById(data.id) });
    modal.render(cardContainer)
    modal.open();
}

//обработка закрытия модального окна
function handleCloseModal() {
    modal.close();
}

//обработка клика по кнопке добавления товара в корзину
function handleAddBasketButton(data: { id: string }) {
    if (basketModel.checkProductById(data.id)) {
        basketModel.removeProduct(data.id);
    } else {
        const product: TBasketItem = catalogModel.getProductById(data.id);
        basketModel.addProduct(product);
    }

    modal.close();
}

//обработка изменения содержимого корзины
function handleBasketChange(data: TBasketItems) {
    basketIcon.render({ count: basketModel.count });

    const itemsContainers = Object.values(data).map((item, i) => {
        return new BasketItemView(cloneTemplate(basketItemTemplate), events).render({ product: item, index: i + 1 });
    })

    basket.render({ items: itemsContainers, totalCost: basketModel.totalCost });
}

//обработка клика по иконке корзины
function handleOpenBasket() {
    const basketContainer = basket.render(null);
    modal.render(basketContainer);
    modal.open();
}

//обработка клика по кнопке удаления товара из корзины
function handleBasketRemoveItem(data: { id: string }) {
    basketModel.removeProduct(data.id);
}

//обработка клика по кнопке оформления заказа
function handleBasketOrderButton() {
    modal.render(orderForm.render(userModel.getUserData()));
}

//обработка клика по кнопке выбора способа оплаты
function handlePaymentButton(data: { paymentMethod: TPaymentMethod }) {
    userModel.paymentMethod = data.paymentMethod;
}

//обработка инпута поле ввода адреса доставки
function handleAdressInput(data: { address: string }) {
    userModel.address = data.address;
}

//обработка сабмита формы заказа
function handleOrderFormSubmit() {
    modal.render(contactsForm.render(userModel.getUserData()));
}

//обработка инпута поле ввода email
function handleEmailInput(data: { email: string }) {
    userModel.email = data.email;
}

//обработка инпута поле ввода телефона
function handlePhoneInput(data: { phone: string }) {
    userModel.phone = data.phone;
}

//обработка сабмита формы контактов
function hancleContactsFormSubmit() {
    api.post('/order', {
        ...userModel.getUserData(),
        ...basketModel.getBasketOrderData()
    }).then((result: OrderData) => {
        modal.render(success.render({ total: result.total }))
    })
}

//обработка изменения данных пользователя
function handleUserDataChange(userData: TUserData) {
    orderForm.render(userData);
    contactsForm.render(userData);
}

//обработка клика по кнопке успешного завершения заказа
function handleSuccessButton() {
    basketModel.clear();
    modal.close();
}

/*------------------------------------------------------------------------------------------------------------------------------------*/
/*АКТИВАЦИЯ СОБЫТИЙ*/
//событие изменения модели каталога товаров
events.on('catalog:change', handleCatalogChange);

//событие клика на карточку товара в каталоге
events.on('ui:catalog-item-open', handleCatalogItemOpen)

//событие закрытия модального окна
events.on('ui:modal-closeModal', handleCloseModal);

//событие клика по кнопке добавления товара в корзину
events.on('ui:cardFull-addBasket', handleAddBasketButton);

//событие изменения содержимого корзины
events.on('basket:change', handleBasketChange);

//событие клика по иконке корзины
events.on('ui:basketIcon-openBasket', handleOpenBasket);

//событие клика по кнопке удаления товара из корзины
events.on('ui:basket-remove-item', handleBasketRemoveItem);

//событие клика по кнопке оформления заказа
events.on('ui:basket-order', handleBasketOrderButton);

//событие клика по кнопке выбора способа оплаты
events.on('ui:orderForm-paymentMethodButton', handlePaymentButton);

//событие инпута поле ввода адреса доставки
events.on('ui:orderForm-addressInput', handleAdressInput);

//событие сабмита формы заказа
events.on('ui:orderForm-submit', handleOrderFormSubmit);

//событие инпута поле ввода email
events.on('ui:contactsForm-emailInput', handleEmailInput);

//событие инпута поле ввода телефона
events.on('ui:contactsForm-phoneInput', handlePhoneInput);

//событие сабмита формы контактов
events.on('ui:contactsForm-submit', hancleContactsFormSubmit);

//событие изменения данных пользователя
events.on('user:change', handleUserDataChange);

//событие клика по кнопке успешного завершения заказа
events.on('ui:successButton', handleSuccessButton);

/*------------------------------------------------------------------------------------------------------------------------------------*/
//запрашиваем данные всех товаров с сервера
api.get('/product')
    .then((result: { items: IProductModel[]; total: number }) => {
        catalogModel.setItems(result.items);
    })