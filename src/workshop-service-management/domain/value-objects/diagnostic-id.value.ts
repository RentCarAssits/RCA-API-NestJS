import { PrimaryColumn } from 'typeorm';

export class DiagnosticId {
  @PrimaryColumn('bigint', { name: 'id' })
  protected readonly id: number;

  protected constructor(id: number) {
    this.id = Number(id);
  }

  public static of(id: number): DiagnosticId {
    return new DiagnosticId(id);
  }

  public static create(value: number) {
    return new DiagnosticId(value);
  }

  public getValue(): number {
    return Number(this.id);
  }
}
