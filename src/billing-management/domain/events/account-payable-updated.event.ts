import { PaymentStatus } from "../enums/payment-status.enum";
import { ServiceType } from "../enums/service-type.enum";

export class AccountPayabelUpdated{
    constructor(
        public readonly id:number,
        public readonly idService:number,
        public readonly payerId:number,
        public readonly payeeId:number,
        public readonly totalPrice:number,
        public readonly parcialPrice:number,
        public readonly expirationDay:Date,
        public readonly state:PaymentStatus,
        public readonly currency:string,
        public readonly tipoServicio:ServiceType
    ){}
}