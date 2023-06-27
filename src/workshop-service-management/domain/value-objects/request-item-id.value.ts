import { PrimaryColumn } from 'typeorm';

export class RequestItemId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(value: number): RequestItemId {
    return new RequestItemId(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
