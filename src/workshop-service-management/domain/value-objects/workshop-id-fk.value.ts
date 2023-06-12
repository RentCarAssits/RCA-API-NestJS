import { PrimaryColumn } from 'typeorm';

export class WorkshopIdFK {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(value: number): WorkshopIdFK {
    return new WorkshopIdFK(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
