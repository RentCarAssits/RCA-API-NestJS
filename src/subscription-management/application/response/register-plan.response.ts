export class RegisterPlanResponse {
  constructor(
    public readonly PlanId: number,
    public readonly PlanName: string,
    public readonly Benefits: string,
    public readonly Price:number,
  ) {}
}
