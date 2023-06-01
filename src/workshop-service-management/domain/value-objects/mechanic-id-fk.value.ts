import { PrimaryColumn } from 'typeorm';

export class MechanicIdFK {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(value: number): MechanicIdFK {
    return new MechanicIdFK(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
