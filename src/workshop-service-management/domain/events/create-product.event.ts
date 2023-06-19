export class CreateProductEvent {
  constructor(
    public readonly id: number,
    public readonly productName: string,
    public readonly quantityProduct: number,
    public readonly price: number,
    public readonly currency: string,
  ) {}
}
