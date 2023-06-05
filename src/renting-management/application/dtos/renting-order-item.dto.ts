export class RentingOrderItemDto {
  public id: number;
  public rentingPrice: number;
  public currency: string;
  public startDate: Date;
  public endDate: Date;
  public vehicleId: number;
  public rentingUnit: string;
  public state: string;
}
