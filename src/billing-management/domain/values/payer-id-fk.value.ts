import { Column } from 'typeorm';

export class PayerIdFk {
  @Column('int', { name: 'payer_id' })
  protected readonly value: number;

  protected constructor(value: number) {
    this.value = Number(value);
  }

  public static of(value: number): PayerIdFk {
    return new PayerIdFk(value);
  }

  public getValue(): number {
    return Number(this.value);
  }
}
