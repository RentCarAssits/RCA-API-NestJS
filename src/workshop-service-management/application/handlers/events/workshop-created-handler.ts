import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { CreateWorkshopEvent } from 'src/workshop-service-management/domain/events/create-workshop.event';

@EventsHandler(CreateWorkshopEvent)
export class WorkshopCreatedHandler
  implements IEventHandler<CreateWorkshopEvent>
{
  constructor() {}

  handle(event: CreateWorkshopEvent) {
    console.log('handle logic for wworkshop Created event');
    console.log(event);
  }
}
