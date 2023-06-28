export class RegisterRentOrderRequest {
  constructor(
    public readonly state: number,
    public readonly renterId: number,
    public readonly itemIds: number[],
  ) {}
}
