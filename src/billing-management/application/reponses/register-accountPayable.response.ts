export class RegisterAccountPayableResponse {
    constructor(
      public readonly accountPayableId: number,
      public readonly payerId: number,
      public readonly payeeId: number,
      public readonly totalPrice: number,
      public readonly state: number,
      public readonly expirationDay: Date
    ) {}
  }