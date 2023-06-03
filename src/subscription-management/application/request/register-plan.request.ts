
export class RegisterPlanRequest {
    constructor(
        public readonly PlanId: Number,
        public readonly PlanName: string,
        public readonly Benefits: string) {

        }
  }