import { PrimaryColumn } from 'typeorm';

export class VehicleId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly value: number;

  protected constructor(value: number) {
    this.value = Number(value);
  }

  public static of(value: number): VehicleId {
    return new VehicleId(value);
  }

  public getValue(): number {
    return Number(this.value);
  }
}
