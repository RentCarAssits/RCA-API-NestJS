export class RegisterPaymentRequest {
    constructor(
        public readonly payerId: number,
        public readonly paymentMethod: string,
        public readonly paymentDay: Date
    ){}
}