import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { CreateProductEvent } from 'src/workshop-service-management/domain/events/create-product.event';
import { CreateRequestItemEvent } from 'src/workshop-service-management/domain/events/create-request-item-event';

@EventsHandler(CreateRequestItemEvent)
export class RequestItemCreatedHandler
  implements IEventHandler<CreateRequestItemEvent>
{
  constructor() {}

  handle(event: CreateRequestItemEvent) {
    console.log('handle logic for request item Created event');
    console.log(event);
  }
}
