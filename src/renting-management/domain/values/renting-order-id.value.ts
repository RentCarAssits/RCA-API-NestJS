import { Column, PrimaryColumn } from 'typeorm';
import { Result } from 'typescript-result';

export class RentingOrderId {
  @PrimaryColumn('int', { name: 'id' })
  protected readonly value: number;

  protected constructor(value: number) {
    this.value = Number(value);
  }

  public static of(value: number): RentingOrderId {
    return new RentingOrderId(value);
  }

  public getValue(): number {
    return Number(this.value);
  }
}
