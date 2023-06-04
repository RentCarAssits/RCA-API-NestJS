export class RegisterPlanRequest {
  constructor(
    public readonly PlanName: string,
    public readonly Benefits: string,
  ) {}
}
