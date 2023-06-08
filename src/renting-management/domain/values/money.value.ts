import { Column } from 'typeorm';

export class Money {
  @Column('decimal', { name: 'price' })
  private readonly amount: number;
  @Column('varchar', { name: 'currency' })
  private readonly currency: string;

  private constructor(amount: number, currency: string) {
    this.amount = Number(amount);
    this.currency = currency;
  }

  public static create(amount: number, currency: string): Money {
    return new Money(amount, currency);
  }

  public add(other: Money): Money {
    return this.newMoney(this.amount + other.getAmount());
  }

  public subtract(other: Money): Money {
    return this.newMoney(this.amount - other.getAmount());
  }

  private newMoney(amount: number): Money {
    return new Money(amount, this.currency);
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }
}
