import { IEventEmitter, IUserModel, TPaymentMethod } from "../types";

export class UserModel implements IUserModel {
    private _paymentMethod: TPaymentMethod;
    private _address: string;
    private _email: string;
    private _phone: string;

    constructor(protected events: IEventEmitter) {
        this._address = '';
        this._paymentMethod = '';
        this._email = '';
        this._phone = '';
    }

    get paymentMethod(): TPaymentMethod {
        return this._paymentMethod;
    }
    set paymentMethod(method: TPaymentMethod) {
        this.events.emit('user:change', this.getUserData());
        this._paymentMethod = method;
    }

    get address(): string {
        return this._address;
    }
    set address(address: string) {
        this.events.emit('user:change', this.getUserData());
        this._address = address;
    }

    get email(): string {
        return this._email;
    }
    set email(email: string) {
        this.events.emit('user:change', this.getUserData());
        this._email = email;
    }

    get phone(): string {
        return this._phone;
    }
    set phone(phone: string) {
        this.events.emit('user:change', this.getUserData());
        this._phone = phone;
    }

    getUserData = () => ({
        paymentMethod: this._paymentMethod,
        address: this._address,
        email: this._email,
        phone: this._phone,
    })
}