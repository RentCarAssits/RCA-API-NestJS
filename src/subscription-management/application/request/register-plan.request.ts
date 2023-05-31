export class RegisterPlanRequest {
    constructor(
        public readonly PlanId: number,
        public readonly PlanName: number,
        public readonly Benefits: number) {

        }
  }