import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { CreateDiagnosticEvent } from 'src/workshop-service-management/domain/events/create-diagnostic.event';
import { CreateInventoryEvent } from 'src/workshop-service-management/domain/events/create-inventory.event';

@EventsHandler(CreateDiagnosticEvent)
export class DiagnosticCreatedHandler
  implements IEventHandler<CreateDiagnosticEvent>
{
  constructor() {}

  handle(event: CreateDiagnosticEvent) {
    console.log('handle logic for diagnostic Created event');
    console.log(event);
  }
}
