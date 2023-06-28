export class RegisterPaymentResponse {
    constructor(
        public readonly paymentId: number,
        public readonly payerId: number,
        public readonly paymentMethod: string,
        public readonly paymentDay: Date
    ){}
}