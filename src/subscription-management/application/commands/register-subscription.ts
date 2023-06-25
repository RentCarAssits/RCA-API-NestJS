export class RegisterSubscription{
    constructor(
        public readonly AccountId:number, // accountID recently
        public readonly PlanId:number,
        public readonly UnitPrice:number,
        public readonly Frequency: string,
        public readonly startDate:Date,
        public readonly endDate: Date,
        public readonly discount: number,
    ){}
} 