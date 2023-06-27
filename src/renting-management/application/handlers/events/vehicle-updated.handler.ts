import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { VehicleUpdated } from 'src/renting-management/domain/events/vehicle-updated.event';

@EventsHandler(VehicleUpdated)
export class VehicleUpdatedHandler implements IEventHandler<VehicleUpdated> {
  constructor() {}

  handle(event: VehicleUpdated) {
    console.log('handle logic for VehicleUpdated event');
    console.log(event);
  }
}
