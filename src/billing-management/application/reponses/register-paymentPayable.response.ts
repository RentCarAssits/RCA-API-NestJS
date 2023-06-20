export class RegisterPaymentPayableResponse{
    constructor(
        public readonly paymentPayableId:number,
        public readonly paymentId:number,
        public readonly accountPayableId:number,
        public readonly amount:number
    ){}
}