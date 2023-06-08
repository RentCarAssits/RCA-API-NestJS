import { PrimaryColumn } from 'typeorm';

export class OwnerIdFK {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(value: number): OwnerIdFK {
    return new OwnerIdFK(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}