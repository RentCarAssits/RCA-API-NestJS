export class SubscriptionRegistered {
  constructor(
    public readonly id: number,
    public readonly AccountId: number,
    public readonly PlanId: number,
    public readonly unitPrice: number,
    public readonly frequency: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly discount: number,
    ) {}
}
