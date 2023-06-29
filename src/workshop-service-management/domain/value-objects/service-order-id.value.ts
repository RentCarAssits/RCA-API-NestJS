import { PrimaryColumn } from 'typeorm';

export class ServiceOrderId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(id: number): ServiceOrderId {
    return new ServiceOrderId(id);
  }

  public static create(value: number) {
    return new ServiceOrderId(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
