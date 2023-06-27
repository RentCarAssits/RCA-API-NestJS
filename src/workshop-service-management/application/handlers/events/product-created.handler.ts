import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { CreateProductEvent } from 'src/workshop-service-management/domain/events/create-product.event';

@EventsHandler(CreateProductEvent)
export class ProductCreatedHandler
  implements IEventHandler<CreateProductEvent>
{
  constructor() {}

  handle(event: CreateProductEvent) {
    console.log('handle logic for product Created event');
    console.log(event);
  }
}
