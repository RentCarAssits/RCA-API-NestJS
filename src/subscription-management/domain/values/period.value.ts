import { AppNotification } from "src/shared/application/app.notification";
import { Column } from "typeorm";
import { Result } from "typescript-result";
export class Period {
  @Column('date',{name:'PeriodStart'})
  protected readonly startDate: Date;
  protected readonly endDate: Date;
  private static CURRENT_TIME = new Date();

  protected constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
  

  public static of(startDate: Date, endDate: Date): Period {
    return new Period(startDate, endDate);
  }

  public static create(startDate: Date, endDate: Date): Result<AppNotification,Period>{
    const notification: AppNotification = new AppNotification();
    if(startDate==null){startDate = new Date();}
    if(endDate==null){endDate = new Date();}
    if (startDate === null) {notification.addError('startDate is required', null);}
    if (endDate === null) {notification.addError('endDate is required', null);}
    
    if (startDate > endDate) {
      notification.addError('The start date should be other one',null,);
    }
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    return Result.ok(new Period(startDate,endDate));
    
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public getEndDate(): Date {
    return this.endDate;
  }

}
   
