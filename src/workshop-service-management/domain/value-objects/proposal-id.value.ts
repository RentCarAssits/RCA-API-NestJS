import { PrimaryColumn } from 'typeorm';

export class ProposalId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(id: number): ProposalId {
    return new ProposalId(id);
  }

  public static create(value: number) {
    return new ProposalId(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
