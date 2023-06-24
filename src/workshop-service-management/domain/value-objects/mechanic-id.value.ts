import { PrimaryColumn } from 'typeorm';

export class MechanicId {
  @PrimaryColumn('bigint', { name: 'mechanic_id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(value: number): MechanicId {
    return new MechanicId(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
