import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { AccountPayableRegistered } from 'src/billing-management/domain/events/account-payable-registered.event';


@EventsHandler(AccountPayableRegistered)
export class AccountPayableRegisteredHandler
  implements IEventHandler<AccountPayableRegistered>
{
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  handle(event: AccountPayableRegistered) {
    console.log('handle logic for account payable registered event');
    console.log(event);
  }
}
