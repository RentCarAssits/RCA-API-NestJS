import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { AppNotification } from '../../../../shared/application/app.notification';
import { CreateRentingOrderItem } from '../../commands/create-renting-order-item.command';
import { RentingOrderItem } from '../../../domain/entities/renting-order-item.entity';
import { Repository } from 'typeorm';
import { Result } from 'typescript-result';
import { Money } from '../../../domain/values/money.value';
import { Period } from '../../../domain/values/period.value';
import { VehicleIdFk } from '../../../domain/values/vehicle-id-fk.value';
import { RentingOrderItemFactory } from '../../../domain/factories/renting-order-item.factory';
import { TimeUnit } from '../../../domain/enums/TimeUnit';
import { VehicleId } from '../../../domain/values/vehicle-id.value';
import { RentingOrderItemId } from '../../../domain/values/renting-order-id.value';

@CommandHandler(CreateRentingOrderItem)
export class CreateRentingOrderItemHandler
  implements ICommandHandler<CreateRentingOrderItem>
{
  constructor(
    @InjectRepository(RentingOrderItem)
    private rentingOrderItemRepository: Repository<RentingOrderItem>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateRentingOrderItem) {
    let rentingOrderItemId = 0;
    const rentingPrice = Money.create(command.rentingPrice, command.currency);
    const rentingUnit = TimeUnit.DAYS;
    const rentingPeriod: Period = Period.newPeriod(
      command.startDate,
      command.endDate,
    );
    const vehicleId: VehicleIdFk = VehicleIdFk.of(command.vehicleId);

    const rentingOrderEntity: RentingOrderItem =
      RentingOrderItemFactory.createFrom(
        rentingPrice,
        rentingPeriod,
        vehicleId,
        rentingUnit,
      );
    let rentingOrderItem = await this.rentingOrderItemRepository.save(
      rentingOrderEntity,
    );
    if (rentingOrderItem == null) {
      return rentingOrderItemId;
    }
    console.log(rentingOrderItem);
    rentingOrderItemId = Number(rentingOrderItem.getId());
    console.log('rentingOrderId:', vehicleId);
    rentingOrderItem.changeId(RentingOrderItemId.of(rentingOrderItemId));
    rentingOrderItem = this.publisher.mergeObjectContext(rentingOrderItem);
    rentingOrderItem.create();
    rentingOrderItem.commit();
    return rentingOrderItemId;
  }
}
