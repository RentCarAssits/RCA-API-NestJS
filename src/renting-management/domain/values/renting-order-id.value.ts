import { Column, PrimaryColumn } from 'typeorm';
import { Result } from 'typescript-result';

export class RentingOrderItemId {
  @PrimaryColumn('int', { name: 'id' })
  protected readonly value: number;

  protected constructor(value: number) {
    this.value = Number(value);
  }

  public static of(value: number): RentingOrderItemId {
    return new RentingOrderItemId(value);
  }

  public getValue(): number {
    return Number(this.value);
  }
}
