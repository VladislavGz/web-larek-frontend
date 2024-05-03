import { IUserModel, TPaymentMethod } from "../types";

export class UserModel implements IUserModel {
    private _paymentMethod: TPaymentMethod;
    private _address: string;
    private _email: string;
    private _phone: string;

    constructor() {
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
    }

    get address(): string {
        return this._address;
    }
    set address(address: string) {
        this._address = address;
    }

    get email(): string {
        return this._email;
    }
    set email(email: string) {
        this._email = email;
    }

    get phone(): string {
        return this._phone;
    }
    set phone(phone: string) {
        this._phone = phone;
    }
}