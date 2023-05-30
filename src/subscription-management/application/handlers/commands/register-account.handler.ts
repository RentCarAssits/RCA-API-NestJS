import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RegisterAccount } from "../../commands/register-account.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Subscription } from "rxjs";
import { Result } from "typescript-result";
import { AppNotification } from "src/shared/application/app.notification";
import { AccountNickname } from "src/subscription-management/domain/values/account-nickname.value";
import { AccountEmail } from "src/subscription-management/domain/values/account-email.value";
import { AccountFactory } from "src/subscription-management/domain/factories/account.factory";
import { Account } from "src/subscription-management/domain/entity/account.entity";


@CommandHandler(RegisterAccount)
export class RegisterVehicleHandler implements ICommandHandler<RegisterAccount>
{
  constructor(@InjectRepository(Account) private accountRepository: Repository<Account>, 
              @InjectRepository(Subscription) private subscriptionRepository: Repository<Subscription>,
              private publisher: EventPublisher){ }

  private Account = Account;

  async execute(command: RegisterAccount) {
    const subscriptions = command.Subscriptions;
    let accountId = 0;

    const AccountNicknameResult: Result<AppNotification,AccountNickname> = 
          AccountNickname.create(command.AccountNickname);
    if(AccountNicknameResult.isFailure()) return accountId;

    const AccountEmailResult: Result<AppNotification,AccountEmail> = 
          AccountEmail.create(command.AccountEmail);
    if(AccountNicknameResult.isFailure()) return accountId;

    //const CreatedDate: Date= command.date;

    /*
    const accountEntity: Account = AccountFactory.createFrom(
      AccountEmailResult.value,
      AccountNickname.value,
    );

    let AccountEntities = subscriptions.map((subscription)=>{
     
    
    });
    */
   
  }
}
