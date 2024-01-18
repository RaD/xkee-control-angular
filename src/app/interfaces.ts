export interface IArea {
    pk: string;
    title: string;
    address: string;
    kind: string;

    access?: string;
    secret?: string;
}


export interface IAreaMap {
    [key: string]: IArea
}


export class Area implements IArea {
    constructor(
        public pk: string,
        public title: string,
        public address: string,
        public kind: string,
        public access?: string,
        public secret?: string,
    ) {}
}
