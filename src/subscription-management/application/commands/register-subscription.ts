export class RegisterSubscription{
    constructor(
        public readonly AccountId:number,
        public readonly PlanId:number,
        public readonly UnitPrice:number,
        public readonly Frequency: string,
        public readonly Period:Date,
        public readonly Period2: Date,
    ){}
}