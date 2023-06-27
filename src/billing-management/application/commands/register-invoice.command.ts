export class CreateInvoice{
    constructor(
        public readonly date: Date,
        public readonly payerId: number,
        public readonly payerAddress: string,
        public readonly serviceId: number,
        public readonly totalPrice: number
    ){

    }
}