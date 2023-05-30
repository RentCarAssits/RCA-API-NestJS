export class RegisterAccountResponse {
    constructor(
        public readonly AccountId: number,
        public readonly AccountEmail: number,
        public readonly AccountNickname: number,
        public readonly Subscriptions: string[]
    ) {}
  }
  