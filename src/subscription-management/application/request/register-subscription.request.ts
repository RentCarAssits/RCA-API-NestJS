export class RegisterSubscriptionRequest {
    constructor(
        public readonly AccountId: number,
        public readonly PlanId: number,
        public readonly UnitPrice: number,
        public readonly Frequency: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly discount: number,
        ) {

        }
  }