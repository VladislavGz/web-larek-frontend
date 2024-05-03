import { CardCatalogView } from './components/CardView';
import { CatalogModel } from './components/CatalogModel';
import { CatalogView } from './components/CatalogView';
import { ModalView } from './components/ModalView';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IProductModel } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

/*------------------------------------------------------------------------------------------------------------------------------------*/
//шаблоны
const catalogItemTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;

//базовые компоненты
const api = new Api(API_URL);
const events = new EventEmitter();

//модели
const catalogModel = new CatalogModel(events);

//отображения
const catalog = new CatalogView(document.querySelector('.gallery'), events);
const modal = new ModalView(document.querySelector('#modal-container'), events);

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

    modal.render({product: catalogModel.getProductById(data.id), cdn: CDN_URL});
    modal.open();
})

//событие закрытия модального окна товара
events.on('ui:modal-card-closeModel', () => {
    console.log('EVT: ui:modal-card-closeModel');

    modal.close();
});

//событие клика по кнопке добавления товара в корзину
events.on('ui:modal-card-addBasket', (data: {id: string}) => {
    console.log(`EVT: ui:modal-card-addBasket | id: ${data.id}`);
})

/*------------------------------------------------------------------------------------------------------------------------------------*/
//запрашиваем данные всех товаров с сервера
api.get('/product')
    .then((result: { items: IProductModel[]; total: number }) => {
        catalogModel.setItems(result.items);
    })