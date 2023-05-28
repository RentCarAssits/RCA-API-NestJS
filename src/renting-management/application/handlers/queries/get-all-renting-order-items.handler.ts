import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RentingOrderItemDto } from '../../dtos/renting-order-item.dto';
import { GetAllRentingOrderItemsQuery } from '../../queries/get-all-renting-order-items.query';
import { getManager } from 'typeorm';

@QueryHandler(GetAllRentingOrderItemsQuery)
export class GetAllRentingOrderItemsHandler
  implements IQueryHandler<GetAllRentingOrderItemsQuery>
{
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async execute(query: GetAllRentingOrderItemsQuery) {
    const manager = getManager();
    const sql = `
    SELECT
      p.id,
      p.rentingUnit,
      p.vehicle_id,
      p.price,
      p.currency,
      p.start_time,
      p.end_time,
    FROM 
      rentingorderitem p
    ORDER BY
      p.id DESC;`;
    const ormRentingOrderItems = await manager.query(sql);
    if (ormRentingOrderItems.length <= 0) {
      return [];
    }
    const rentingOrderItems: RentingOrderItemDto[] = ormRentingOrderItems.map(
      function (ormRentingOrderItems) {
        const rentingOrderItemDto = new RentingOrderItemDto();
        rentingOrderItemDto.id = Number(ormRentingOrderItems.id);
        rentingOrderItemDto.rentingPrice = ormRentingOrderItems.price;
        rentingOrderItemDto.rentingUnit = ormRentingOrderItems.rentingUnit;
        rentingOrderItemDto.currency = ormRentingOrderItems.currency;
        rentingOrderItemDto.startDate = ormRentingOrderItems.startDate;
        rentingOrderItemDto.endDate = ormRentingOrderItems.endDate;
        rentingOrderItemDto.vehicleId = ormRentingOrderItems.vehicleId;
        return rentingOrderItemDto;
      },
    );
    return rentingOrderItems;
  }
}
