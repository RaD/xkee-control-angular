import { Customer } from "../customer/interface";
import { Device } from "../device/interface";

export interface LinkedT {
    [propkey: string]: string[];
}


export interface IArea {
    pk: string;  // UUID
    title: string;
    address: string;
    kind: string;

    devices: string[];
    customers: string[];
    linked: LinkedT;

    access?: string;
    secret?: string;

    export_devices?: Device[];
    export_customers?: Customer[];
}


export class Area implements IArea {
    constructor(
        public pk: string,
        public title: string,
        public address: string,
        public kind: string,
        public devices: string[],
        public customers: string[],
        public linked: LinkedT,
        public access?: string,
        public secret?: string,
        public export_devices?: Device[],
        public export_customers?: Customer[],
    ) {}
}
