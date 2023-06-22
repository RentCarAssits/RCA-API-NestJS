export class CreatePayment{
    constructor(
        public readonly payerId: number,
        public readonly paymentMethod: string,
        public readonly paymentDay: Date,
    ) {}
}