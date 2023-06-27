import { PrimaryColumn } from 'typeorm';

export class InventoryTransactionId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(id: number): InventoryTransactionId {
    return new InventoryTransactionId(id);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
