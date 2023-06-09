export class RegisterSubscriptionResponse {
    constructor(
        public readonly SubscriptionId: number,
        public readonly UnitPrice: number,
        public readonly discount: number,
        public readonly AccountId:number,
        public readonly PlanId: number,
        public readonly Frequency: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
    ) {}
  }
  