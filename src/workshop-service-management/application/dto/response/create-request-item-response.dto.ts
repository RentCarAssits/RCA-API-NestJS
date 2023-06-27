export class CreateRequestItemResponseDto {
  constructor(
    public readonly id: number,
    public readonly quantityRequestItem: number,
    public readonly amount: number,
    public readonly currency: string,
    public readonly productId: number,
    public readonly serviceItemId: number,
  ) {}
}
