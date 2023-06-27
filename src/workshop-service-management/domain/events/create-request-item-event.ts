export class CreateRequestItemEvent {
  constructor(
    public readonly id: number,
    public readonly quantityRequestItem: number,
    public readonly amount: number,
    public readonly currency: string,
  ) {}
}
