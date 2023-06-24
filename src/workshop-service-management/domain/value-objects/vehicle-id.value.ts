import { Column } from 'typeorm';

export class VehicleId {
  @Column('bigint', { name: 'vehicle_id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(value: number): VehicleId {
    return new VehicleId(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
