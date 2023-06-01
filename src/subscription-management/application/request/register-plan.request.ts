export class RegisterPlanRequest {
    constructor(
        public readonly PlanId: number,
        public readonly PlanName: string,
        public readonly Benefits: string) {

        }
  }