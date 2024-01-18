export interface IDevice {
    pk: string;
    title: string;
    description: string;
}


export class Device implements IDevice {
    constructor(
        public pk: string,
        public title: string,
        public description: string,
    ) {}
}
