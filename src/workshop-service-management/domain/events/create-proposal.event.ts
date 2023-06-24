export class CreateProposalEvent {
  constructor(
    public readonly id: number,
    public readonly humanResources: number,
    public readonly amount: number,
    public readonly currency: string,
    public readonly start: Date,
    public readonly end: Date,
  ) {}
}
