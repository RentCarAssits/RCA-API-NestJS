import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RentingOrderItemDto } from '../../dtos/renting-order-item.dto';
import { GetAllRentingOrderItemsQuery } from '../../queries/get-all-renting-order-items.query';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import { RentingOrderItem } from '../../../domain/entities/renting-order-item.entity';
import { VehicleDto } from '../../dtos/vehicle.dto';

@QueryHandler(GetAllRentingOrderItemsQuery)
export class GetAllRentingOrderItemsHandler
  implements IQueryHandler<GetAllRentingOrderItemsQuery>
{
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    @InjectRepository(RentingOrderItem)
    private readonly rentingOrderItemRepository: Repository<RentingOrderItem>,
  ) {}

  async execute(
    query: GetAllRentingOrderItemsQuery,
  ): Promise<RentingOrderItemDto[]> {
    const ormRentingOrderItems = await this.rentingOrderItemRepository.find({
      relations: {},
    });
    console.log(
      '🚀 ~ file: vehicles-queries.handler.ts:18 ~ GetAllVehiclesHandler ~ execute ~ vehicles:',
      ormRentingOrderItems['result'],
    );
    const rentingOrderItems: RentingOrderItemDto[] = ormRentingOrderItems.map(
      function (ormRentingOrderItems) {
        const rentingOrderItemDto = new RentingOrderItemDto();
        rentingOrderItemDto.id = Number(ormRentingOrderItems.getId());
        rentingOrderItemDto.rentingPrice =
          ormRentingOrderItems.rentingPrice.getAmount();
        rentingOrderItemDto.rentingUnit = ormRentingOrderItems.rentingUnit;
        rentingOrderItemDto.currency =
          ormRentingOrderItems.rentingPrice.getCurrency();
        rentingOrderItemDto.startDate =
          ormRentingOrderItems.rentingPeriod.getStartDate();
        rentingOrderItemDto.endDate =
          ormRentingOrderItems.rentingPeriod.getEndDate();
        rentingOrderItemDto.vehicleId =
          ormRentingOrderItems.vehicleId.getValue();
        return rentingOrderItemDto;
      },
    );
    return rentingOrderItems;
  }
}
