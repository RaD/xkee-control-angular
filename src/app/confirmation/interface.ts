export interface IConfirmationEntity {
    pk: string;
    name: string;
    title: string;
    description: string;
}


export class ConfirmationEntity implements IConfirmationEntity {
    constructor(
        public pk: string,
        public name: string,
        public title: string,
        public description: string,
    ) {}
}