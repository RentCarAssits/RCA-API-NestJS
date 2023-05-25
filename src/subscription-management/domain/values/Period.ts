import { PrimaryColumn } from "typeorm";

export class Period {
  @PrimaryColumn('int', { name: 'SubscriptionId' })
  protected readonly startDate: Date;
  protected readonly endDate: Date;

  protected constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public static of(startDate: Date, endDate: Date): Period {
    return new Period(startDate, endDate);
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public getEndDate(): Date {
    return this.endDate;
  }
}
