export class RegisterPaymentPayableResponse{
    constructor(
        public readonly id:number,
        public readonly paymentId:number,
        public readonly accountPayableId:number,
        public readonly amount:number
    ){}
}