import { Column } from 'typeorm';

export class OwnerId {
  @Column('bigint', { name: 'owner_id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(value: number): OwnerId {
    return new OwnerId(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
