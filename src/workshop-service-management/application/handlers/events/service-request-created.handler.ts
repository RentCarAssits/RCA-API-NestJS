import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { ServiceRequestCreated } from '../../../domain/events/service-request-created.event';

@EventsHandler(ServiceRequestCreated)
export class ServiceRequestCreatedHandler
  implements IEventHandler<ServiceRequestCreated>
{
  constructor() {}

  handle(event: ServiceRequestCreated) {
    console.log('handle logic for service request Created event');
    console.log(event);
  }
}
