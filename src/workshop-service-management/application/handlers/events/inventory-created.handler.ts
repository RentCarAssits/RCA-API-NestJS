import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { CreateInventoryEvent } from 'src/workshop-service-management/domain/events/create-inventory.event';

@EventsHandler(CreateInventoryEvent)
export class InventoryCreatedHandler
  implements IEventHandler<CreateInventoryEvent>
{
  constructor() {}

  handle(event: CreateInventoryEvent) {
    console.log('handle logic for renting item Created event');
    console.log(event);
  }
}
