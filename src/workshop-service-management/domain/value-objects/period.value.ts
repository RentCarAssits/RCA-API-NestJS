import { Column } from 'typeorm';

export class Period {
  @Column('date', { name: 'start' })
  private start: Date;

  @Column('date', { name: 'end' })
  private end: Date;

  public constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }

  public static create(start: Date, end: Date): Period {
    return new Period(start, end);
  }

  public getStart() {
    return this.start;
  }

  public getEnd() {
    return this.end;
  }
}
