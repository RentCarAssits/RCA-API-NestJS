import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RentingOrderItemDto } from '../../dtos/renting-order-item.dto';
import { GetAllRentingOrderItemsQuery } from '../../queries/get-all-renting-order-items.query';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RentingOrderItem } from '../../../domain/entities/renting-order-item.entity';
import { GetRentingOrderItemByIdQuery } from '../../queries/get-renting-order-item-by-id.query';
import { GetAllRentingItemsByVehicleQuery } from '../../queries/get-all-renting-items-by-vehicle.query';
import { GetAllRentingItemsByRenterIdQuery } from '../../queries/get-all-renting-items-by-renter-id.query';
import { GetAllAcceptedRentingItemsByRenterIdQuery } from '../../queries/get-all-accepted-renting-items-by-renter-id.query';
import { RentingOrderItemState } from '../../../domain/enums/renting-order-item-state.enum';

@QueryHandler(GetAllRentingOrderItemsQuery)
export class RentingOrderItemsQueriesHandler
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
      relations: { requester: true },
    });
    console.log(
      '🚀 ~ file: renting-queries.handler.ts:18 ~ GetAllRentingItemsHandler ~ execute ~ rentingItems:',
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
        rentingOrderItemDto.state = ormRentingOrderItems.state;
        rentingOrderItemDto.requesterId = ormRentingOrderItems.requester.id;
        return rentingOrderItemDto;
      },
    );
    return rentingOrderItems;
  }
}

@QueryHandler(GetRentingOrderItemByIdQuery)
export class GetRentingOrderItemByIdHandler
  implements IQueryHandler<GetRentingOrderItemByIdQuery>
{
  constructor(
    @InjectRepository(RentingOrderItem)
    private readonly rentingOrderItemRepository: Repository<RentingOrderItem>,
    private readonly connection: Connection,
  ) {}

  async execute(query: GetRentingOrderItemByIdQuery) {
    const ormRentingOrderItems = await this.rentingOrderItemRepository
      .createQueryBuilder()
      .where('RentingOrderItem.id = :id', { id: query.rentingId })
      .getOne();
    console.log(
      '🚀 ~ file: vehicles-queries.handler.ts:18 ~ GetAllVehiclesHandler ~ execute ~ vehicles:',
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

    return rentingOrderItemDto;
  }
}

@QueryHandler(GetAllRentingItemsByVehicleQuery)
export class GetRentingOrderItemByVehiclesIdHandler
  implements IQueryHandler<GetAllRentingItemsByVehicleQuery>
{
  constructor(
    @InjectRepository(RentingOrderItem)
    private readonly rentingOrderItemRepository: Repository<RentingOrderItem>,
    private readonly connection: Connection,
  ) {}

  async execute(
    query: GetAllRentingItemsByVehicleQuery,
  ): Promise<RentingOrderItemDto[]> {
    const tempIdList = query.vehiclesId;
    console.log(tempIdList);
    const ormRentingOrderItems = await this.rentingOrderItemRepository
      .createQueryBuilder()
      .where('vehicle_id IN (:...tempIdList)', { tempIdList })
      .getMany();

    console.log(ormRentingOrderItems);
    const rentingOrderItems: RentingOrderItemDto[] = ormRentingOrderItems.map(
      (ormRentingOrderItem) => {
        const rentingOrderItemDto = new RentingOrderItemDto();
        rentingOrderItemDto.id = Number(ormRentingOrderItem.id);
        rentingOrderItemDto.rentingPrice =
          ormRentingOrderItem.rentingPrice.getAmount();
        rentingOrderItemDto.rentingUnit = ormRentingOrderItem.rentingUnit;
        rentingOrderItemDto.currency =
          ormRentingOrderItem.rentingPrice.getCurrency();
        rentingOrderItemDto.startDate =
          ormRentingOrderItem.rentingPeriod.getStartDate();
        rentingOrderItemDto.endDate =
          ormRentingOrderItem.rentingPeriod.getEndDate();
        rentingOrderItemDto.vehicleId =
          ormRentingOrderItem.vehicleId.getValue();
        rentingOrderItemDto.state = ormRentingOrderItem.state;
        rentingOrderItemDto.requesterId = 0;
        return rentingOrderItemDto;
      },
    );
    return rentingOrderItems;
  }
}

@QueryHandler(GetAllRentingItemsByRenterIdQuery)
export class GetAllRentingItemsByRenterIdHandler
  implements IQueryHandler<GetAllRentingItemsByRenterIdQuery>
{
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    @InjectRepository(RentingOrderItem)
    private readonly rentingOrderItemRepository: Repository<RentingOrderItem>,
  ) {}

  async execute(
    query: GetAllRentingItemsByRenterIdQuery,
  ): Promise<RentingOrderItemDto[]> {
    const ormRentingOrderItems = await this.rentingOrderItemRepository.find({
      where: { requester: { id: query.renterId } },
    });
    console.log('IDDDDDDDDD: ', query.renterId);
    const rentingOrderItems: RentingOrderItemDto[] = ormRentingOrderItems.map(
      (ormRentingOrderItem) => {
        const rentingOrderItemDto = new RentingOrderItemDto();
        rentingOrderItemDto.id = Number(ormRentingOrderItem.id);
        rentingOrderItemDto.rentingPrice =
          ormRentingOrderItem.rentingPrice.getAmount();
        rentingOrderItemDto.rentingUnit = ormRentingOrderItem.rentingUnit;
        rentingOrderItemDto.currency =
          ormRentingOrderItem.rentingPrice.getCurrency();
        rentingOrderItemDto.startDate =
          ormRentingOrderItem.rentingPeriod.getStartDate();
        rentingOrderItemDto.endDate =
          ormRentingOrderItem.rentingPeriod.getEndDate();
        rentingOrderItemDto.vehicleId =
          ormRentingOrderItem.vehicleId.getValue();
        rentingOrderItemDto.state = ormRentingOrderItem.state;
        rentingOrderItemDto.requesterId = 0;
        return rentingOrderItemDto;
      },
    );
    return rentingOrderItems;
  }
}

@QueryHandler(GetAllAcceptedRentingItemsByRenterIdQuery)
export class GetAllAcceptedRentingItemsByRenterIdHandler
  implements IQueryHandler<GetAllAcceptedRentingItemsByRenterIdQuery>
{
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    @InjectRepository(RentingOrderItem)
    private readonly rentingOrderItemRepository: Repository<RentingOrderItem>,
  ) {}

  async execute(
    query: GetAllRentingItemsByRenterIdQuery,
  ): Promise<RentingOrderItemDto[]> {
    const ormRentingOrderItems = await this.rentingOrderItemRepository.find({
      where: {
        requester: { id: query.renterId },
        state: RentingOrderItemState.Accepted,
      },
    });
    console.log('llego aqui', ormRentingOrderItems);
    const rentingOrderItems: RentingOrderItemDto[] = ormRentingOrderItems.map(
      (ormRentingOrderItem) => {
        const rentingOrderItemDto = new RentingOrderItemDto();
        rentingOrderItemDto.id = Number(ormRentingOrderItem.id);
        rentingOrderItemDto.rentingPrice =
          ormRentingOrderItem.rentingPrice.getAmount();
        rentingOrderItemDto.rentingUnit = ormRentingOrderItem.rentingUnit;
        rentingOrderItemDto.currency =
          ormRentingOrderItem.rentingPrice.getCurrency();
        rentingOrderItemDto.startDate =
          ormRentingOrderItem.rentingPeriod.getStartDate();
        rentingOrderItemDto.endDate =
          ormRentingOrderItem.rentingPeriod.getEndDate();
        rentingOrderItemDto.vehicleId =
          ormRentingOrderItem.vehicleId.getValue();
        rentingOrderItemDto.state = ormRentingOrderItem.state;
        rentingOrderItemDto.requesterId = 0;
        return rentingOrderItemDto;
      },
    );
    return rentingOrderItems;
  }
}
