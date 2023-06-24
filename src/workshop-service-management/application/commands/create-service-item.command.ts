export class CreateServiceItemCommand {
  constructor(
    public readonly serviceType: string,
    public readonly resources: number,
    public readonly amount: number,
    public readonly currency: string,
    public readonly proposalId: number,
  ) {}
}
