import moment from "moment-timezone";
import { DateTime } from "src/renting-management/domain/values/date-time.value";
import { AppNotification } from "src/shared/application/app.notification";
import { Column } from "typeorm";
import { Result } from "typescript-result";
export class Period {
  @Column('date',{name:'startDate'})
  protected readonly startDate: Date;

  @Column('date',{name:'endDate'})
  protected readonly endDate: Date;

  protected constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public static from(startDate:Date,endDate:Date) {
    return new Period(startDate, endDate);
  }

  public getStartDate(): Date {
    return this.startDate;
  }
  
  public getEndDate(): Date {
    return this.endDate;
  }

}
   









/*
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
*/