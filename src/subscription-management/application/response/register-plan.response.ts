export class RegisterPlanResponse {
    constructor(
        public readonly PlanId: Number,
        public readonly PlanName: string,
        public readonly Benefits: string
    ) {}
  }
  