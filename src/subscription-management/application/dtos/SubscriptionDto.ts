export class SubscriptionDto {
  public SubscriptionId: number;
  public AccountId: number; // accountId Recently
  public PlanId: number;
  public UnitPrice: number;
  public Frequency: string;
  public startDate: Date;
  public endDate: Date;
}
 