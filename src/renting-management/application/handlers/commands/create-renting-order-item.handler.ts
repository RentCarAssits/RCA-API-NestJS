import {
  CommandHandler,
  EventPublisher,
  ICommandHandler,
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { AppNotification } from '../../../../shared/application/app.notification';
import { CreateRentingOrderItem } from '../../commands/create-renting-order-item.command';
import { RentingOrderItem } from '../../../domain/entities/renting-order-item.entity';
import { Connection, Repository } from 'typeorm';
import { Result } from 'typescript-result';
import { Money } from '../../../domain/values/money.value';
import { Period } from '../../../domain/values/period.value';
import { VehicleIdFk } from '../../../domain/values/vehicle-id-fk.value';
import { RentingOrderItemFactory } from '../../../domain/factories/renting-order-item.factory';
import { TimeUnit } from '../../../domain/enums/TimeUnit';
import { VehicleId } from '../../../domain/values/vehicle-id.value';
import { RentingOrderItemId } from '../../../domain/values/renting-order-id.value';
import { GetVehicleByIdQuery } from '../../queries/get-vehicle-by-id.query';
import { VehicleDto } from '../../dtos/vehicle.dto';
import { GetRentingOrderItemByIdQuery } from '../../queries/get-renting-order-item-by-id.query';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import { RentingOrderItemState } from '../../../domain/enums/renting-order-item-state.enum';
import { User } from '../../../../iam-management/domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateRentingOrderItem)
export class CreateRentingOrderItemHandler
  implements ICommandHandler<CreateRentingOrderItem>
{
  constructor(
    @InjectRepository(RentingOrderItem)
    private rentingOrderItemRepository: Repository<RentingOrderItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateRentingOrderItem) {
    let rentingOrderItemId = 0;
    const rentingPrice = Money.create(command.rentingPrice, command.currency);

    const rentingUnit = TimeUnit.DAYS;

    const accepted = RentingOrderItemState.OnRequest;
    const rentingPeriod: Period = Period.newPeriod(
      command.startDate,
      command.endDate,
    );
    const vehicleId: VehicleIdFk = VehicleIdFk.of(command.vehicleId);
    const id: number = command.requesterId;
    const user = await this.userRepository.findOne({ where: { id: id } });
    const rentingOrderEntity: RentingOrderItem =
      RentingOrderItemFactory.createFrom(
        rentingPrice,
        rentingPeriod,
        vehicleId,
        rentingUnit,
        accepted,
      );

    console.log(user);
    rentingOrderEntity.requester = user;
    const rentingOrderItemAux = await this.rentingOrderItemRepository.create(
      rentingOrderEntity,
    );
    let rentingOrderItem = await this.rentingOrderItemRepository.save(
      rentingOrderItemAux,
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
