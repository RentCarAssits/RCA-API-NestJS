import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { CreateProductEvent } from 'src/workshop-service-management/domain/events/create-product.event';
import { CreateRequestItemEvent } from 'src/workshop-service-management/domain/events/create-request-item-event';
import { CreateServiceItemEvent } from 'src/workshop-service-management/domain/events/create-service-item.event';

@EventsHandler(CreateServiceItemEvent)
export class ServiceItemCreatedHandler
  implements IEventHandler<CreateServiceItemEvent>
{
  constructor() {}

  handle(event: CreateServiceItemEvent) {
    console.log('handle logic for service item Created event');
    console.log(event);
  }
}
