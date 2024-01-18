export interface IFormArea {
    pk: string;
    title: string;
    address: string;
    kind: string;

    remove: boolean;

    access?: string;
    secret?: string;

}


export class FormArea implements IFormArea {
    constructor(
        public pk: string,
        public title: string,
        public address: string,
        public kind: string,
        public remove: boolean,
        public access?: string,
        public secret?: string,
    ) {}
}
