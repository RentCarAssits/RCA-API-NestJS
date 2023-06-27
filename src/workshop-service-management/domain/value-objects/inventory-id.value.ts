import { PrimaryColumn } from 'typeorm';

export class InventoryId {
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(id: number): InventoryId {
    return new InventoryId(id);
  }
  public static create(value: number) {
    return new InventoryId(value);
  }
  public getValue(): number {
    return Number(this.id);
  }
}
