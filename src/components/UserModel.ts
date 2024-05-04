import { IEventEmitter, IUserModel, TPaymentMethod, TUserData } from "../types";

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
        this._paymentMethod = method;
        this.events.emit('user:change', this.getUserData());
    }

    get address(): string {
        return this._address;
    }
    set address(address: string) {
        this._address = address;
        this.events.emit('user:change', this.getUserData());
    }

    get email(): string {
        return this._email;
    }
    set email(email: string) {
        this._email = email;
        this.events.emit('user:change', this.getUserData());
    }

    get phone(): string {
        return this._phone;
    }
    set phone(phone: string) {
        this._phone = phone;
        this.events.emit('user:change', this.getUserData());
    }

    getUserData = (): TUserData => ({
        paymentMethod: this._paymentMethod,
        address: this._address,
        email: this._email,
        phone: this._phone,
    })
}