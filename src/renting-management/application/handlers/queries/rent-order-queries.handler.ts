import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RentOrder } from 'src/renting-management/domain/entities/rent-order.entity';
import { GetRentOrdersByOwnerQuery } from '../../queries/get-rent-orders-by-owner.query';
import { RentOrderInfoOwnerDto } from '../../dtos/rent-order-info-owner.dto';
import { GetRentOrdersByRenterQuery } from '../../queries/get-rent-orders-by-renter.query';
import { RentOrderInfoRenterDto } from '../../dtos/rent-order-info-renter.dto';

@QueryHandler(GetRentOrdersByOwnerQuery)
export class GetRentOrderFullInfoHandler
  implements IQueryHandler<GetRentOrdersByOwnerQuery>
{
  constructor(
    @InjectRepository(RentOrder)
    private readonly rentOrderRepository: Repository<RentOrder>,
    private readonly connection: Connection,
  ) {}

  async execute(query: GetRentOrdersByOwnerQuery) {
    const manager = this.connection.manager;
    const sql = `
    SELECT 
        ro.*, 
        renter.userName,
        renter.email,
        v.name,
        v.image,
        roi.price,
        roi.rentingUnit,
        roi.start_time,
        roi.end_time
        FROM rent_orders ro
        INNER JOIN renting_order_items roi ON ro.id = roi.rent_order_id
        INNER JOIN vehicles v ON roi.vehicle_id = v.id
        INNER JOIN users renter ON ro.renter_id = renter.id
        WHERE v.owner_id = ?
        `;
    const result = await manager.query(sql, [query.owner.id]);

    if (result.length === 0) {
      return [];
    }

    return result.map((rent: any) => {
      const rentOrderDto = new RentOrderInfoOwnerDto();
      rentOrderDto.id = rent.id;
      rentOrderDto.state = rent.state;
      rentOrderDto.renterId = rent.renter_id;
      rentOrderDto.renterName = rent.userName;
      rentOrderDto.renterEmail = rent.email;
      rentOrderDto.vehicleName = rent.name;
      rentOrderDto.vehicleImage = rent.image;
      rentOrderDto.rentingItemPrice = rent.price;
      rentOrderDto.rentingUnitTime = rent.rentingUnit;
      rentOrderDto.startTime = rent.start_time;
      rentOrderDto.endTime = rent.end_time;
      return rentOrderDto;
    });
  }
}

@QueryHandler(GetRentOrdersByRenterQuery)
export class GetRentOrderFullInfoRenterHandler
  implements IQueryHandler<GetRentOrdersByRenterQuery>
{
  constructor(
    @InjectRepository(RentOrder)
    private readonly rentOrderRepository: Repository<RentOrder>,
    private readonly connection: Connection,
  ) {}

  async execute(query: GetRentOrdersByRenterQuery) {
    const manager = this.connection.manager;
    const sql = `
    SELECT 
        ro.*, 
        owner.userName,
        owner.email,
        v.name,
        v.image,
        roi.price,
        roi.rentingUnit,
        roi.start_time,
        roi.end_time
        FROM rent_orders ro
        INNER JOIN renting_order_items roi ON ro.id = roi.rent_order_id
        INNER JOIN vehicles v ON roi.vehicle_id = v.id
        INNER JOIN users owner ON v.owner_id = owner.id
        WHERE ro.renter_id = ?
    `;
    const result = await manager.query(sql, [query.renter.id]);

    if (result.length === 0) {
      return [];
    }

    return result.map((item) => {
      const rentOrderDto = new RentOrderInfoRenterDto();
      rentOrderDto.id = item.id;
      rentOrderDto.state = item.state;
      rentOrderDto.ownerId = item.owner_id;
      rentOrderDto.ownerName = item.userName;
      rentOrderDto.ownerEmail = item.email;
      rentOrderDto.vehicleName = item.name;
      rentOrderDto.vehicleImage = item.image;
      rentOrderDto.rentingItemPrice = item.price;
      rentOrderDto.rentingUnitTime = item.rentingUnit;
      rentOrderDto.startTime = item.start_time;
      rentOrderDto.endTime = item.end_time;
      return rentOrderDto;
    });
  }
}
/*
export class RentOrderInfoOwner {
  public id?: number;
  public state: string;
  public renterId: number;
  public renterName: number;
  public renterEmail: string;
  public vehicleName: string;
  public vehicleImage: string;
  public rentingItemPrice: string;
  public rentingUnitTime: string;
  public startTime: string;
  public endTime: string;
}

*/
