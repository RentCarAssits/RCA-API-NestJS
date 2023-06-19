export class CreateProductResponseDto {
  constructor(
    public readonly id: number,
    public readonly productName: string,
    public readonly quantityProduct: number,
    public readonly quantity: number,
    public readonly currency: string,
    public readonly inventoryId: number,
  ) {}
}
