import { Column } from 'typeorm';

export class Period {
  @Column('decimal', { name: 'start_date' })
  protected readonly startDate: Date;

  @Column('varchar', { name: 'end_date' })
  protected readonly endDate: Date;

  protected constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public static create(startDate: Date, endDate: Date): Period {
    return new Period(startDate, endDate);
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public getCurrency(): Date {
    return this.endDate;
  }
}
