export class RentingOrderItemDto {
  public id: number;
  public rentingPrice: number;
  public currency: string;
  public startDate: Date;
  public endDate: Date;
  public rentingUnit: string;
  public state: string;
  public requesterId: number;
  public requesterName: string;
  public ownerId: number;
  public vehicleId: number;
  public vehicleName: string;
}
