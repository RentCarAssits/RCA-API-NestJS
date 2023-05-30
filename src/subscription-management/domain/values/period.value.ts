import { AppNotification } from "src/shared/application/app.notification";
import { Column } from "typeorm";
import { Result } from "typescript-result";
export class Period {
  @Column('varchar', { name: 'Period' })
  protected readonly value:string;
  private static MAX_LENGTH: number = 100;

  protected constructor(value:string) {
    this.value = value;
  }

  public getValues():string{
    return this.value;
  }

  public static create(period:string): Result<AppNotification,Period>{
    const notification: AppNotification = new AppNotification;
    period=(period??'').trim();
    if (period === '') {notification.addError('Period is required', null);}
    
    if (period.length > this.MAX_LENGTH) {notification.addError('The maximum length of an Period is '+this.MAX_LENGTH +' characters including spaces',null,);}
    
    if (notification.hasErrors()) {return Result.error(notification);}

    return Result.ok(new Period(period));
  }

}
   
