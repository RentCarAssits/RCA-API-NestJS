import { PrimaryColumn } from 'typeorm';
export class WorkshopId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(id: number): WorkshopId {
    return new WorkshopId(id);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
