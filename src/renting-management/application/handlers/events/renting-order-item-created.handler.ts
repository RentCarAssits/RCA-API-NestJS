import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { RentingOrderItemCreated } from '../../../domain/events/renting-order-item-created.event';

@EventsHandler(RentingOrderItemCreated)
export class RentingOrderItemCreatedHandler
  implements IEventHandler<RentingOrderItemCreated>
{
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  handle(event: RentingOrderItemCreated) {
    console.log('handle logic for renting item Created event');
    console.log(event);
  }
}
