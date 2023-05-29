import { AppNotification } from 'src/shared/application/app.notification';
import { Column } from 'typeorm';
import { Result } from 'typescript-result';

export class AccountName {
  @Column('varchar', { name: 'AccountName' })
  private readonly value: string;
  private static MAX_LENGTH: number = 100;
  private constructor(value: string) {
    this.value = value;
  }
  public getValue(): string {
    return this.value;
  }
  public static create(accountName:string): Result<AppNotification,AccountName>{
    const notification: AppNotification = new AppNotification();
    accountName=(accountName??'').trim();
    if (accountName === '') {notification.addError('name is required', null);}
    if(accountName.length>100){notification.addError('The maximum length of an category is ' +this.MAX_LENGTH +' characters including spaces',null,);}
    if (notification.hasErrors()) {return Result.error(notification);}
    return Result.ok(new AccountName(accountName));
  }
}