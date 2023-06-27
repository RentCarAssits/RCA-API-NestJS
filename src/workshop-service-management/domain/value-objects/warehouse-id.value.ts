import { Column } from 'typeorm';

export class WarehouseId {
  @Column('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(id: number): WarehouseId {
    return new WarehouseId(id);
  }

  public static create(value: number) {
    return new WarehouseId(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
