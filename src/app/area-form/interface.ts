export interface IArea {
    pk: string;
    title: string;
    address: string;
    kind: string;

    devices: string[];
    customers: string[];

    access?: string;
    secret?: string;
}


export class Area implements IArea {
    constructor(
        public pk: string,
        public title: string,
        public address: string,
        public kind: string,
        public devices: string[],
        public customers: string[],
        public access?: string,
        public secret?: string,
    ) {}
}
