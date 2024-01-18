export interface IConfirmationEntity {
    name: string;
    message: string;
    title: string;
    description: string;
    url_success: string;
    url_cancel: string;
}


export class ConfirmationEntity implements IConfirmationEntity {
    constructor(
        public name: string,
        public message: string,
        public title: string,
        public description: string,
        public url_success: string,
        public url_cancel: string,
    ) {}
}