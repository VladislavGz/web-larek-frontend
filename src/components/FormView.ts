import { IEventEmitter, IView, TPaymentMethod } from "../types";

abstract class FormView implements IView {

    protected errors: HTMLSpanElement;
    protected submitBtn: HTMLButtonElement;

    constructor(protected container: HTMLFormElement, protected events: IEventEmitter) {
        this.errors = this.container.querySelector('.form__errors') as HTMLSpanElement;
        this.submitBtn = this.container.querySelector('.submit-button') as HTMLButtonElement;
    }

    render(data?: object): HTMLElement {
        return this.container;
    }
}

export class FormOrderView extends FormView {

    protected orderButtonCard: HTMLButtonElement;
    protected orderButtonCash: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEventEmitter) {
        super(container, events);
        this.orderButtonCard = this.container.elements.namedItem('card') as HTMLButtonElement;
        this.orderButtonCash = this.container.elements.namedItem('cash') as HTMLButtonElement;
        this.addressInput = this.container.elements.namedItem('address') as HTMLInputElement;

        this.orderButtonCard.addEventListener('click', () => {
            this.setPaymentMethod('card');
            this.events.emit('ui:orderForm-orderButtonCard', {});
        });

        this.orderButtonCash.addEventListener('click', () => {
            this.setPaymentMethod('cash');
            this.events.emit('ui:orderForm-orderButtonCash', {});
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('ui:orderForm-addressInput', {});
        })
    }

    setPaymentMethod(method: string): void {
        if (method === 'card') {
            this.orderButtonCard.classList.add('button_alt-active');
            this.orderButtonCash.classList.remove('button_alt-active');
            return;
        }

        if (method === 'cash') {
            this.orderButtonCard.classList.remove('button_alt-active');
            this.orderButtonCash.classList.add('button_alt-active');
            return;
        }

        this.orderButtonCard.classList.remove('button_alt-active');
        this.orderButtonCash.classList.remove('button_alt-active');
    }

    override render(data?: { paymentMethod: TPaymentMethod, address: string }): HTMLElement {
        if (data) {
            this.setPaymentMethod(data.paymentMethod);
            this.addressInput.value = data.address;
        }

        return this.container;
    }
}

