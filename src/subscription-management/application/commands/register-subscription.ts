export class RegisterSubscription{
    constructor(
        public readonly accountId:number, // accountID recently
        public readonly planId:number,
        public readonly unitPrice:number,
        public readonly frequency: string,
        public readonly startDate:Date,
        public readonly endDate: Date,
    ){}
}