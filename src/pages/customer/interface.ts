import { IPayment } from "../payment/interface";

export interface ICustomer {
    pk: string;  // номер телефона
    active: boolean;
    last_name: string;
    first_name: string;
    middle_name?: string;
    address?: string;
    vehicle?: string;
    comment?: string;
    payments?: IPayment[];
    synced?: string;  // дата последней синхронизации в формате YYYY-MM-DD
    mm3hash?: string;  // MurmurHash3 of phone number
}


export class Customer implements ICustomer {
    constructor(
        public pk: string,
        public active: boolean,
        public last_name: string,
        public first_name: string,
        public middle_name?: string,
        public address?: string,
        public vehicle?: string,
        public comment?: string,
        public payments?: IPayment[],
        public synced?: string,
        public mm3hash?: string,
    ) {}
}
