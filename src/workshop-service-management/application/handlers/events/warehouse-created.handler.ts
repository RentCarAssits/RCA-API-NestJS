import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { CreateInventoryEvent } from 'src/workshop-service-management/domain/events/create-inventory.event';
import { CreateWarehouseEvent } from 'src/workshop-service-management/domain/events/create-warehouse.event';

@EventsHandler(CreateWarehouseEvent)
export class WarehouseCreatedHandler
  implements IEventHandler<CreateWarehouseEvent>
{
  constructor() {}

  handle(event: CreateWarehouseEvent) {
    console.log('handle logic for warehouse Created event');
    console.log(event);
  }
}
