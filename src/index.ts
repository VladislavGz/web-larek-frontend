import { BasketIconView } from './components/BasketIconView';
import { BasketModel } from './components/BasketModel';
import { CardCatalogView, CardFullView } from './components/CardView';
import { CatalogModel } from './components/CatalogModel';
import { CatalogView } from './components/CatalogView';
import { ModalView } from './components/ModalView';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IBasketModel, IProductModel, TBasketItem, } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

/*------------------------------------------------------------------------------------------------------------------------------------*/
//шаблоны
const catalogItemTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardFullTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;

//базовые компоненты
const api = new Api(API_URL);
const events = new EventEmitter();

//модели
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);

//отображения
const catalog = new CatalogView(document.querySelector('.gallery'), events);
const modal = new ModalView(document.querySelector('#modal-container'), events);
const cardFull = new CardFullView(cloneTemplate(cardFullTemplate), events);
const basketIcon = new BasketIconView(document.querySelector('.header__basket'), events);

/*------------------------------------------------------------------------------------------------------------------------------------*/
//событие изменения модели каталога товаров
events.on('catalog:change', (data: { items: IProductModel[] }) => {
    console.log('EVT: catalog:change')

    let itemsContainers = data.items.map(item => {
        return new CardCatalogView(cloneTemplate(catalogItemTemplate), events).render({product: item, cdn: CDN_URL});
    })

    catalog.render({items: itemsContainers});
});

//событие клика на карточку товара в каталоге
events.on('ui:catalog-item-open', (data: { id: string }) => {
    console.log(`EVT: ui:catalog-item-open | id: ${data.id}`);

    const cardContainer = cardFull.render({product: catalogModel.getProductById(data.id), cdn: CDN_URL});
    modal.render(cardContainer)
    modal.open();
})

//событие закрытия модального окна товара
events.on('ui:modal-closeModal', () => {
    console.log('EVT: ui:modal-closeModal');

    modal.close();
});

//событие клика по кнопке добавления товара в корзину
events.on('ui:cardFull-addBasket', (data: {id: string}) => {
    console.log(`EVT: ui:cardFull-addBasket | id: ${data.id}`);

    const product: TBasketItem = catalogModel.getProductById(data.id);
    basketModel.addProduct(product);
});

//событие изменения содержимого корзины
events.on('basket:change', (basket: IBasketModel) => {
    console.log(`EVT: basket:change | count: ${basket.count}`);

    basketIcon.render({count: basket.count});
});

/*------------------------------------------------------------------------------------------------------------------------------------*/
//запрашиваем данные всех товаров с сервера
api.get('/product')
    .then((result: { items: IProductModel[]; total: number }) => {
        catalogModel.setItems(result.items);
    })