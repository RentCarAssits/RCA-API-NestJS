import { PrimaryColumn } from 'typeorm';

export class ServiceRequestId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(value: number): ServiceRequestId {
    return new ServiceRequestId(value);
  }

  public static create(value: number) {
    return new ServiceRequestId(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
