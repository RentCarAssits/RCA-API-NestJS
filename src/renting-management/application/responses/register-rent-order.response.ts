export class RegisterRentOrderResponse {
  constructor(
    public id: number,
    public state: number,
    public renterId: number,
    public itemIds: number[],
  ) {}
}
