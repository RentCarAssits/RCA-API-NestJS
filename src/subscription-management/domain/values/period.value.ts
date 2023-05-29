//import * as moment from 'moment-timezone';
export class Period {
  protected readonly startDate: Date;
  protected readonly endDate: Date;

  protected constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public static of(startDate: Date, endDate: Date): Period {
    return new Period(startDate, endDate);
  }

  /*
  public static createPeriod(startDate: string, endDate: string): Period {
    const startDateTime: Date = moment(startDate, 'YYYY-MM-DD HH:mm:ss').toDate();
    const endDateTime: Date = moment(endDate, 'YYYY-MM-DD HH:mm:ss').toDate();
    return new Period(startDateTime, endDateTime);
  }
  */

  public getStartDate(): Date {
    return this.startDate;
  }

  public getEndDate(): Date {
    return this.endDate;
  }
}
