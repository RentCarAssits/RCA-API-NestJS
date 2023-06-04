export class RegisterAccountPayableRequest {
    constructor(
      public readonly payerId: number,
      public readonly payeeId: number,
      public readonly totalPrice: number,
      public readonly expirationDay: Date
    ) {}
  }