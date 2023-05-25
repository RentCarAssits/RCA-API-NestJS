import { PrimaryColumn } from 'typeorm';

export class Model {
  @PrimaryColumn('varchar', { name: 'model' })
  protected readonly value: string;
  private static MAX_LENGTH = 30;

  protected constructor(value: string) {
    this.value = value;
  }

  public static of(value: string): Model {
    return new Model(value);
  }

  public getValue(): number {
    return Number(this.value);
  }
}
