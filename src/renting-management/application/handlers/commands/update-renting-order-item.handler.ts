import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateRentingOrderItem } from '../../commands/create-renting-order-item.command';
import { InjectRepository } from '@nestjs/typeorm';
import { RentingOrderItem } from '../../../domain/entities/renting-order-item.entity';
import { Repository } from 'typeorm';
import { Money } from '../../../domain/values/money.value';
import { TimeUnit } from '../../../domain/enums/TimeUnit';
import { RentingOrderItemState } from '../../../domain/enums/renting-order-item-state.enum';
import { Period } from '../../../domain/values/period.value';
import { VehicleIdFk } from '../../../domain/values/vehicle-id-fk.value';
import { RentingOrderItemFactory } from '../../../domain/factories/renting-order-item.factory';
import { RentingOrderItemId } from '../../../domain/values/renting-order-id.value';
import { UpdateRentingOrderItemCommand } from '../../commands/update-renting-order-item.command';
import { RentingOrderItemDto } from '../../dtos/renting-order-item.dto';

@CommandHandler(UpdateRentingOrderItemCommand)
export class UpdateRentingOrderItemHandler
  implements ICommandHandler<UpdateRentingOrderItemCommand>
{
  constructor(
    @InjectRepository(RentingOrderItem)
    private rentingOrderItemRepository: Repository<RentingOrderItem>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: UpdateRentingOrderItemCommand) {
    let rentingOrderItemId = command.id;
    let state: RentingOrderItemState | undefined;

    switch (command.state) {
      case 'O':
        state = RentingOrderItemState.OnRequest;
        break;
      case 'A':
        state = RentingOrderItemState.Accepted;
        break;
      case 'D':
        state = RentingOrderItemState.Denied;
        break;
      case 'R':
        state = RentingOrderItemState.Ordered;
        break;
      default:
        // Handle the case when the input doesn't match any enum value
        break;
    }
    console.log(command);

    //no es necesario
    const ormRentingOrderItems = await this.rentingOrderItemRepository
      .createQueryBuilder()
      .where('RentingOrderItem.id = :id', { id: command.id })
      .getOne();
    console.log(
      '🚀 ~ file: update-queries.handler.ts:18 ~ GetAllVehiclesHandler ~ execute ~ vehicles:',
      ormRentingOrderItems['result'],
    );
    const rentingOrderItemDto = new RentingOrderItemDto();
    rentingOrderItemDto.id = Number(ormRentingOrderItems.getId());
    rentingOrderItemDto.rentingPrice = ormRentingOrderItems.rentingPrice
      .getAmount()
      .valueOf();
    rentingOrderItemDto.rentingUnit = ormRentingOrderItems.rentingUnit;
    rentingOrderItemDto.currency =
      ormRentingOrderItems.rentingPrice.getCurrency();
    rentingOrderItemDto.startDate =
      ormRentingOrderItems.rentingPeriod.getStartDate();
    rentingOrderItemDto.endDate =
      ormRentingOrderItems.rentingPeriod.getEndDate();
    rentingOrderItemDto.vehicleId = ormRentingOrderItems.vehicleId.getValue();
    rentingOrderItemDto.state = state;

    const rentingPeriod: Period = Period.newPeriod(
      rentingOrderItemDto.startDate,
      rentingOrderItemDto.endDate,
    );
    const rentingPrice = Money.create(
      rentingOrderItemDto.rentingPrice,
      rentingOrderItemDto.currency,
    );
    const vehicleId: VehicleIdFk = VehicleIdFk.of(
      rentingOrderItemDto.vehicleId,
    );
    const updatedRentingOrderItemId: RentingOrderItemId = RentingOrderItemId.of(
      command.id,
    );
    const rentingUnit = TimeUnit.DAYS;

    let itemState: RentingOrderItemState | undefined;
    switch (rentingOrderItemDto.state) {
      case 'O':
        itemState = RentingOrderItemState.OnRequest;
        break;
      case 'A':
        itemState = RentingOrderItemState.Accepted;
        break;
      case 'D':
        itemState = RentingOrderItemState.Denied;
        break;
      case 'R':
        itemState = RentingOrderItemState.Ordered;
        break;
      default:
        // Handle the case when the input doesn't match any enum value
        break;
    }
    //hasta aqui llega lo que no es necesario
    console.log('rentingOrderItemDto:', rentingOrderItemDto);
    let updatedRentingOrder: RentingOrderItem = new RentingOrderItem(
      rentingPrice,
      rentingPeriod,
      vehicleId,
      rentingUnit,
      itemState,
    );
    updatedRentingOrder.id = updatedRentingOrderItemId;
    const updatedItem = await this.rentingOrderItemRepository
      .createQueryBuilder()
      .update(RentingOrderItem)
      .set({ state: updatedRentingOrder.state })
      .where('id = :id', { id: command.id })
      .execute();
    console.log(updatedRentingOrder);
    rentingOrderItemId = Number(updatedRentingOrder.getId());
    console.log('rentingOrderId:');
    updatedRentingOrder.changeId(RentingOrderItemId.of(rentingOrderItemId));
    updatedRentingOrder =
      this.publisher.mergeObjectContext(updatedRentingOrder);
    updatedRentingOrder.create();
    updatedRentingOrder.commit();
    return rentingOrderItemId;
  }
}
