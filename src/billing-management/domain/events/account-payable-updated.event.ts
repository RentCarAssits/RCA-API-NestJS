
export class AccountPayableUpdated {
  constructor(
    public readonly id: number,
    public readonly payerId: number,
    public readonly payeeId: number,
    public readonly totalPrice: number,
    public readonly parcialPrice: number,
    public readonly expirationDate: Date,
  ) {}
}
