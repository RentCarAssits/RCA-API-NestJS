import { Column } from 'typeorm';

export class Period {
  @Column('datetime', { name: 'start_time' })
  private readonly startDate: Date;
  @Column('datetime', { name: 'end_time' })
  private readonly endDate: Date;

  private constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public static newPeriod(startDate: Date, endDate: Date): Period {
    return new Period(startDate, endDate);
  }

  public getStartDate() {
    return this.startDate;
  }
  public getEndDate() {
    return this.endDate;
  }

  public getPeriodTimeDays(): number {
    const diffTime = Math.abs(
      this.endDate.getTime() - this.startDate.getTime(),
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
