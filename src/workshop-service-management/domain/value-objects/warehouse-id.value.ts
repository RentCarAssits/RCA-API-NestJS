import { PrimaryColumn } from 'typeorm';

export class WarehouseId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(id: number): WarehouseId {
    return new WarehouseId(id);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
