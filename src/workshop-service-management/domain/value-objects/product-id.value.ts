import { PrimaryColumn } from 'typeorm';

export class ProductId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(value: number): ProductId {
    return new ProductId(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
