import { BasketIconView } from './components/BasketIconView';
import { BasketItemView } from './components/BasketItemView';
import { BasketModel } from './components/BasketModel';
import { BasketView } from './components/BasketView';
import { CardCatalogView, CardFullView } from './components/CardView';
import { CatalogModel } from './components/CatalogModel';
import { CatalogView } from './components/CatalogView';
import { FormOrderView } from './components/FormView';
import { ModalView } from './components/ModalView';
import { UserModel } from './components/UserModel';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IProductModel, TBasketItem, TBasketItems, } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

/*------------------------------------------------------------------------------------------------------------------------------------*/
//шаблоны
const catalogItemTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardFullTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;

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

/*------------------------------------------------------------------------------------------------------------------------------------*/
//событие изменения модели каталога товаров
events.on('catalog:change', (data: { items: IProductModel[] }) => {
    console.log('EVT: catalog:change')

    let itemsContainers = data.items.map(item => {
        return new CardCatalogView(cloneTemplate(catalogItemTemplate), events).render({ product: item, cdn: CDN_URL });
    })

    catalog.render({ items: itemsContainers });
});

//событие клика на карточку товара в каталоге
events.on('ui:catalog-item-open', (data: { id: string }) => {
    console.log(`EVT: ui:catalog-item-open | id: ${data.id}`);

    const cardContainer = cardFull.render({ product: catalogModel.getProductById(data.id), cdn: CDN_URL });
    modal.render(cardContainer)
    modal.open();
})

//событие закрытия модального окна товара
events.on('ui:modal-closeModal', () => {
    console.log('EVT: ui:modal-closeModal');

    modal.close();
});

//событие клика по кнопке добавления товара в корзину
events.on('ui:cardFull-addBasket', (data: { id: string }) => {
    console.log(`EVT: ui:cardFull-addBasket | id: ${data.id}`);

    const product: TBasketItem = catalogModel.getProductById(data.id);
    basketModel.addProduct(product);
});

//событие изменения содержимого корзины
events.on('basket:change', (data: TBasketItems) => {
    console.log(`EVT: basket:change | count: ${basketModel.count}`);

    basketIcon.render({ count: basketModel.count });

    const itemsContainers = Object.values(data).map((item, i) => {
        return new BasketItemView(cloneTemplate(basketItemTemplate), events).render({ product: item, index: i + 1 });
    })

    basket.render({ items: itemsContainers, totalCost: basketModel.totalCost });
});

//событие клика по иконке корзины
events.on('ui:basketIcon-openBasket', () => {
    console.log(`EVT: ui:basketIcon-openBasket`);

    const basketContainer = basket.render(null);
    modal.render(basketContainer);
    modal.open();
});

//событие клика по кнопке удаления товара из корзины
events.on('ui:basket-remove-item', (data: {id: string}) => {
    console.log(`EVT: ui:basket-remove-item | id: ${data.id}`);

    basketModel.removeProduct(data.id);
});

//событие клика по кнопке оформления заказа
events.on('ui:basket-order', () => {
    console.log(`EVT: ui:basket-order`);

    modal.render(orderForm.render());
});

//событие клика по кнопке выбора способа оплаты картой
events.on('ui:orderForm-orderButtonCard', () => {
    console.log(`EVT: ui:orderForm-orderButtonCard`);
    userModel.paymentMethod = 'card';
});

//событие клика по кнопке выбора способа оплаты при получении
events.on('ui:orderForm-orderButtonCash', () => {
    console.log(`EVT: ui:orderForm-orderButtonCash`);
    userModel.paymentMethod = 'cash';
});

//событие инпута поле ввода адреса доставки
events.on('ui:orderForm-addressInput', () => {
    console.log(`EVT: ui:orderForm-addressInput`);
});

//событие сабмита формы заказа
events.on('ui:orderForm-submit', () => {
    console.log(`EVT: ui:orderForm-submit`);
});

/*------------------------------------------------------------------------------------------------------------------------------------*/
//запрашиваем данные всех товаров с сервера
api.get('/product')
    .then((result: { items: IProductModel[]; total: number }) => {
        catalogModel.setItems(result.items);
    })