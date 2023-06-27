export class CreateProductDto {
  constructor(
    public readonly productName: string,
    public readonly quantityProduct: number,
    public readonly amount: number,
    public readonly currency: string,
    public readonly inventoryId: number,
  ) {}
}
