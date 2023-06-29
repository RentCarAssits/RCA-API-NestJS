export class RegisterInvoiceResponse{
    constructor(
        public readonly invoiceId: number,
        public readonly date: Date,
        public readonly payerId: number,
        public readonly payerAddress: string,
        public readonly serviceId: number,
        public readonly totalPrice: number
    ){}
}