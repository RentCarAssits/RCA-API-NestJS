import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { VehicleRegistered } from 'src/renting-management/domain/events/vehicle-registered.event';

@EventsHandler(VehicleRegistered)
export class ProductRegisteredHandler
  implements IEventHandler<VehicleRegistered>
{
  constructor() {}

  handle(event: VehicleRegistered) {
    console.log('handle logic for ProductRegistered event');
    console.log(event);
  }
}
