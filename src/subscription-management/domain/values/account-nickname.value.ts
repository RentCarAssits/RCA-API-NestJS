import { AppNotification } from 'src/shared/application/app.notification';
import { Column } from 'typeorm';
import { Result } from 'typescript-result';

export class AccountNickname {
  @Column('varchar', { name: 'AccountNickname' })
  private readonly value: string;
  private static MAX_LENGTH: number = 100;
  private constructor(value: string) {
    this.value = value;
  }
  public getValue(): string {
    return this.value;
  }
  public static create(accountNickname:string): Result<AppNotification,AccountNickname>{
    const notification: AppNotification = new AppNotification();
    accountNickname=(accountNickname??'').trim();
    if (accountNickname === '') {notification.addError('name is required', null);}
    if(accountNickname.length>100){notification.addError('The maximum length of an Nickname is ' +this.MAX_LENGTH +' characters including spaces',null,);}
    if (notification.hasErrors()) {return Result.error(notification);}
    return Result.ok(new AccountNickname(accountNickname));
  }
}