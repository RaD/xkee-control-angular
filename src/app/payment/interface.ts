import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export interface IPayment {
    amount: number;
    started_in: NgbDateStruct;
    expired_in: NgbDateStruct;
}


export class Payment implements IPayment {
    constructor(
        public amount: number,
        public started_in: NgbDateStruct,
        public expired_in: NgbDateStruct,
    ) {}
}
