import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { RentOrderRegistered } from 'src/renting-management/domain/events/rent-order-registered.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { RentingOrderItem } from 'src/renting-management/domain/entities/renting-order-item.entity';
import { VehiclesApplicationService } from '../../services/vehicles-application.service';
import { RentingOrderItemService } from '../../services/renting-order-item.service';

@EventsHandler(RentOrderRegistered)
export class RentOrderRegisteredHandler
  implements IEventHandler<RentOrderRegistered>
{
  constructor(
    private readonly vehicleService: VehiclesApplicationService,
    private readonly rentingOrderItemService: RentingOrderItemService,
  ) {}

  async handle(event: RentOrderRegistered) {
    console.log('handle logic for RentOrderRegistered event');
    const result = event;
    const itemIds = result.items;

    if (event.items) {
      try {
        await this.vehicleService.updateVehicleState(itemIds);
        await this.rentingOrderItemService.updateAsAccepted(itemIds);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
