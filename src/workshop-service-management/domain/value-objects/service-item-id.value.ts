import { PrimaryColumn } from 'typeorm';

export class ServiceItemId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(value: number): ServiceItemId {
    return new ServiceItemId(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
