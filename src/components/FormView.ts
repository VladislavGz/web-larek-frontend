import { IEventEmitter, IView, TPaymentMethod } from "../types";

abstract class FormView implements IView {

    protected errors: HTMLSpanElement;
    protected submitBtn: HTMLButtonElement;

    constructor(protected container: HTMLFormElement, protected events: IEventEmitter) {
        this.errors = this.container.querySelector('.form__errors') as HTMLSpanElement;
        this.submitBtn = this.container.querySelector('.submit-button') as HTMLButtonElement;
    }

    enableSubmitButton() {
        this.submitBtn.removeAttribute('disabled');
    }

    disableSubmitButton() {
        this.submitBtn.setAttribute('disabled', 'true');
    }

    validate(validityState: string) {
        if (validityState) {
            this.disableSubmitButton();
            this.errors.textContent = this.errors.getAttribute(`${validityState}`);
        } else {
            this.enableSubmitButton();
            this.errors.textContent = '';
        }
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
            this.events.emit('ui:orderForm-paymentMethodButton', {paymentMethod: 'online'});
        });

        this.orderButtonCash.addEventListener('click', () => {
            this.events.emit('ui:orderForm-paymentMethodButton', {paymentMethod: 'cash'});
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('ui:orderForm-addressInput', {address: this.addressInput.value});
        })

        this.container.addEventListener('submit', evt => {
            evt.preventDefault();
            this.events.emit('ui:orderForm-submit', {});
        });
    }

    setPaymentMethod(method: TPaymentMethod): void {
        if (method === 'online') {
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

    checkValidity(): string {
        if (!(this.orderButtonCard.classList.contains('button_alt-active') || this.orderButtonCash.classList.contains('button_alt-active'))) return 'data-err-paymentMethod';
        if(!this.addressInput.value) return 'data-err-adress';
        return '';
    }

    override render(data?: { payment: TPaymentMethod, address: string }): HTMLElement {
        if (data) {
            this.setPaymentMethod(data.payment);
            this.addressInput.value = data.address;
            this.validate(this.checkValidity());
        }

        return this.container;
    }
}

export class FormContactsView extends FormView {

    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEventEmitter) {
        super(container, events);
        this.emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
        this.phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;

        this.emailInput.addEventListener('input', () => {
            this.events.emit('ui:contactsForm-emailInput', {email: this.emailInput.value});
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('ui:contactsForm-phoneInput', {phone: this.phoneInput.value});
        });

        this.container.addEventListener('submit', evt => {
            evt.preventDefault();
            this.events.emit('ui:contactsForm-submit', {});
        });
    }

    checkValidity(): string {
        if (!this.emailInput.value) return 'data-err-email';
        if (!this.phoneInput.value) return 'data-err-phone';
        return '';
    }

    override render(data?: {email: string, phone: string}): HTMLElement {
        if (data) {
            this.emailInput.value = data.email;
            this.phoneInput.value = data.phone;
            this.validate(this.checkValidity());
        }

        return this.container;
    }
}

