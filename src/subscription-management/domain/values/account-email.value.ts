import { AppNotification } from "src/shared/application/app.notification";
import { PrimaryColumn } from "typeorm";
import { Result } from "typescript-result";

export class AccountEmail {
  @PrimaryColumn({ name: 'AccountEmail' })
  protected readonly Email: string;
  private static MAX_LENGTH = 100;
  protected constructor(Email: string) {
    this.Email = Email;
  }

  public static of(value: string): AccountEmail {
    return new AccountEmail(value);
  }

  public getValue(): string {
    return this.Email;
  }

  public static create(accountEmail:string): Result<AppNotification,AccountEmail>{
    const notification: AppNotification = new AppNotification();
    accountEmail=(accountEmail??'').trim();
    if (accountEmail === '') {notification.addError('name is required', null);}
    if(accountEmail.length>100){notification.addError('The maximum length of an Nickname is ' +this.MAX_LENGTH +' characters including spaces',null,);}
    if (notification.hasErrors()) {return Result.error(notification);}
    return Result.ok(new AccountEmail(accountEmail));
  }

}
