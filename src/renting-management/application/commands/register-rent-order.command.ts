export class RegisterRentOrder {
  constructor(
    public readonly state: number,
    public readonly renterId: number,
    public readonly items: number[],
  ) {}
}
