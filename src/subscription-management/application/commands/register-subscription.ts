export class RegisterSubscription{
    constructor(
        //public readonly SubscriptionId:number,
        public readonly AccountId:number,
        public readonly PlanId:number,
        public readonly UnitPrice:number,
        public readonly Frequency: string,
        public readonly Period:string,
    ){}
}