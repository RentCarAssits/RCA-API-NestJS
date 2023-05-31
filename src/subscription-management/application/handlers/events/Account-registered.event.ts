import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AccountRegistered } from "src/subscription-management/domain/events/account-registered.event";

@EventsHandler(AccountRegistered)
export class AccountRegisteredHandler implements IEventHandler<AccountRegistered>{
    constructor(){}
    handle(event: AccountRegistered) {
        console.log('handle logic for AccountRegistered event');
         console.log(event);
    }
}