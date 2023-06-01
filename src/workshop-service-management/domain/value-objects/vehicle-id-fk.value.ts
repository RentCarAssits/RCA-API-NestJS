import { PrimaryColumn } from 'typeorm';

export class VehicleIdFK {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(value: number): VehicleIdFK {
    return new VehicleIdFK(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}