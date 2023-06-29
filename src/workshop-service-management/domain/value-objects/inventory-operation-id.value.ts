import { PrimaryColumn } from 'typeorm';

export class InventoryOperationId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(id: number): InventoryOperationId {
    return new InventoryOperationId(id);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
