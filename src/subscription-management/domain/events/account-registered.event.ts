export class AccountRegistered{
    constructor(
        public readonly AccountId: number,
        //public readonly userId: number,
        public readonly AccountEmail: string,
        public readonly AccountNickname: string,
        ) {}
}