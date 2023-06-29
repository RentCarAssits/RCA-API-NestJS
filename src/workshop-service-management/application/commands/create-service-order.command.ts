export class CreateServiceOrderCommand {
  constructor(
    public readonly humanResources: number,
    public readonly amount: number,
    public readonly currency: string,
    public readonly start: Date,
    public readonly end: Date,
  ) {}
}
