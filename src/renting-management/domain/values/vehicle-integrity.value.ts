import { Column } from 'typeorm';
import { Result } from 'typescript-result';

export class VehicleIntegrity {
  @Column('varchar', { name: 'integrity' })
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }
}
