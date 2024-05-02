import { CatalogItemView } from './components/CatalogItemView';
import { CatalogModel } from './components/CatalogModel';
import { CatalogView } from './components/CatalogView';
import { ModalViewCardFull } from './components/ModalView';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IProductModel } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

//шаблоны
const catalogItemTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;

//базовые компоненты
const api = new Api(API_URL);
const events = new EventEmitter();

//модели
const catalogModel = new CatalogModel(events);

//отображения
const catalog = new CatalogView(document.querySelector('.gallery'), events);
const modalCard = new ModalViewCardFull(document.querySelector('#modal-card-full'), events);

//событие изменения модели каталога товаров
events.on('catalog:change', (data: { items: IProductModel[] }) => {
    console.log('EVT: catalog:change')

    let itemsContainers = data.items.map(item => {
        return new CatalogItemView(cloneTemplate(catalogItemTemplate), events).render({product: item, cdn: CDN_URL});
    })

    catalog.render({items: itemsContainers});
});

//событие клика на карточку товара в каталоге
events.on('ui:catalog-item-open', (data: { id: string }) => {
    console.log(`EVT: ui:catalog-item-open | id: ${data.id}`);
})


//запрашиваем данные всех товаров с сервера
api.get('/product')
    .then((result: { items: IProductModel[]; total: number }) => {
        catalogModel.setItems(result.items);
    })