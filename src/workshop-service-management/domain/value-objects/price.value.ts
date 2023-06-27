import { Column } from 'typeorm';

export class Price {
  @Column('decimal', { name: 'amount' })
  protected readonly amount: number;

  @Column('varchar', { name: 'currency' })
  protected readonly currency: string;

  protected constructor(amount: number, currency: string) {
    this.amount = amount;
    this.currency = currency;
  }

  public static create(amount: number, currency: string): Price {
    return new Price(amount, currency);
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }
}
