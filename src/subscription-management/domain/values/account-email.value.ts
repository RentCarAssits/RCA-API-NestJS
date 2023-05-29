import { AppNotification } from "src/shared/application/app.notification";
import { Column } from "typeorm";
import { Result } from "typescript-result";

export class AccountEmail {
  @Column('varchar', { name: 'category' })
  protected readonly Email: string;
  private static MAX_LENGHT = 100;

  protected constructor(Email: string) {
    this.Email = Email;
  }

  public static of(value: string): AccountEmail {
    return new AccountEmail(value);
  }

  public getValue(): string {
    return this.Email;
  }

  public static create(accountEmail:string): Result<AppNotification, AccountEmail>{
    const notification: AppNotification = new AppNotification;
    accountEmail = (accountEmail??'').trim();
    if(accountEmail == ''){
      notification.addError('Email is required', null);
    }
    if(accountEmail.length>=this.MAX_LENGHT){
      notification.addError('The maximun lenght of accountEmail is' + this.MAX_LENGHT + 'this includ spaces between letters', null);
    }
    if(notification.hasErrors()){
      return Result.error(notification);
    }

    return Result.ok(new AccountEmail(accountEmail));
  }


}
