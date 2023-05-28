import { Column } from 'typeorm';

export class VehicleIdFk {
  @Column('int', { name: 'vehicle_id' })
  protected readonly value: number;

  protected constructor(value: number) {
    this.value = Number(value);
  }

  public static of(value: number): VehicleIdFk {
    return new VehicleIdFk(value);
  }

  public getValue(): number {
    return Number(this.value);
  }
}
