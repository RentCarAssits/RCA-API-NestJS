export class SubscriptionDto {
  public id: number;
  public PlanId: number;
  //public AccountId: number;
  public UnitPrice: number;
  public Frequency: string;
  public startDate: Date;
  public endDate: Date;
}
