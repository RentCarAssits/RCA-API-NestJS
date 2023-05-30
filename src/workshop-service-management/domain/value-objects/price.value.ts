import { Column } from 'typeorm';

export class Price {
  @Column('decimal', { name: 'quantity' })
  protected readonly quantity: number;

  @Column('varchar', { name: 'currency' })
  protected readonly currency: string;

  protected constructor(quantity: number, currency: string) {
    this.quantity = quantity;
    this.currency = currency;
  }

  public static create(quantity: number, currency: string): Price {
    return new Price(quantity, currency);
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getCurrency(): string {
    return this.currency;
  }
}
