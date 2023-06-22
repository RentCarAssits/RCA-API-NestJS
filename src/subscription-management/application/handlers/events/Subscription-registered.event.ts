import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SubscriptionRegistered } from 'src/subscription-management/domain/events/subscription-registered.event';

@EventsHandler(SubscriptionRegistered)
export class SubscriptionRegisteredHanlder
  implements IEventHandler<SubscriptionRegistered>
{
  constructor() {}

  handle(event: SubscriptionRegistered) {
    console.log('handle logic for SubscriptionRegistered event');
    console.log('xd:', event);
  }
}
