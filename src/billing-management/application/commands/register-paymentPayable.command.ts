export class CreatePaymentPayable {
    constructor(
        public readonly paymentId: number,
        public readonly accountPayableId: number,
        public readonly amount: number,
    ){}
  }