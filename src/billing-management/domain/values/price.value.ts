import { Column } from "typeorm";

export class Price {
  @Column('decimal', { name: 'total_price' })
  protected readonly total: number;

  @Column('decimal', { name: 'parcial_price' })
  protected readonly parcial: number;


  protected constructor(total: number, parcial: number) {
    this.total = Number(total);
    this.parcial = Number(parcial);
  }

  public static create(value: number, parcial: number): Price {
    return new Price(value, parcial);
  }

  public getTotal(): number {
    return this.total
  }

  public getParcial(): number {
    return this.parcial
  }
}