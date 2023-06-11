export class CreateRequestItemEvent {
  constructor(
    public readonly id: number,
    public readonly quantityRequestItem: number,
    public readonly quantity: number,
    public readonly currency: string,
  ) {}
}
