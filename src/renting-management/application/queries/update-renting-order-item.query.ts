export class UpdateRentingOrderItemQuery {
  public constructor(
    public readonly rentingId: number,
    public readonly state: string,
  ) {}
}
