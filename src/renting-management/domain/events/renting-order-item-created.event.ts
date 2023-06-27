export class RentingOrderItemCreated {
  constructor(
    public readonly id: number,
    public readonly rentingPrice: number,
    public readonly currency: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly vehicleId: number,
    public readonly rentingUnit: string,
    public readonly accepted: string,
  ) {}
}
