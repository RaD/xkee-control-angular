export interface ICustomer {
    pk: string;
    active: boolean;
    last_name: string;
    first_name: string;
    middle_name?: string;
    address?: string;
    vehicle?: string;
    comment?: string;
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
    ) {}
}
