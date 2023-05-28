import { PrimaryColumn } from "typeorm";

export class PlanId {
  @PrimaryColumn('int', { name: 'Planid' })
  protected readonly value: number;

  protected constructor(value: number) {
    this.value = Number(value);
  }

  public static of(value: number): PlanId {
    return new PlanId(value);
  }

  public getValue(): number {
    return Number(this.value);
  }
}