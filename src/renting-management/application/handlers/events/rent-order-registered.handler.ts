import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { RentOrderRegistered } from 'src/renting-management/domain/events/rent-order-registered.event';

@EventsHandler(RentOrderRegistered)
export class RentOrderRegisteredHandler
  implements IEventHandler<RentOrderRegistered>
{
  constructor() {}

  handle(event: RentOrderRegistered) {
    console.log('handle logic for RentOrderRegistered event');
    const result = event;
    const itemIds = result.items;
    
    console.log(event);
  }
}
