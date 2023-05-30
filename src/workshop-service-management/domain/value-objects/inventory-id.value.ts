import { PrimaryColumn } from 'typeorm';

export class InventoryId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(id: number): InventoryId {
    return new InventoryId(id);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
