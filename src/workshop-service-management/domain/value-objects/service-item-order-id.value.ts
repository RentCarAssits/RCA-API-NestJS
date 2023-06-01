import { PrimaryColumn } from 'typeorm';

export class ServiceItemOrderId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(id: number): ServiceItemOrderId {
    return new ServiceItemOrderId(id);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
