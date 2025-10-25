import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export interface IPayment {
    amount: number;
    started_in: NgbDateStruct;
    expired_in: NgbDateStruct;
    registered_in: number;
    mm3hash?: string;  // MurmurHash3 of "amount|started|expired"
}


export class Payment implements IPayment {
    constructor(
        public amount: number,
        public started_in: NgbDateStruct,
        public expired_in: NgbDateStruct,
        public registered_in: number,
        public mm3hash?: string,
    ) {}
}
