import { Column } from 'typeorm';
import { Result } from 'typescript-result';

export class Benefits {
  @Column('varchar', { name: 'Benefits' })
  private readonly value: string;
  private static MAX_LENGTH: number = 250;

  private constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }
}