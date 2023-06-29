import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllInventoryQuery } from '../../queries/get-all-inventory.query';
import { DataSource, getManager } from 'typeorm';
import { InventoryDto } from '../../dto/inventory.dto';
import { GetInventoryByIdQuery } from '../../queries/get-inventory-by-id.query';

@QueryHandler(GetAllInventoryQuery)
export class GetAllInventoryHandler
  implements IQueryHandler<GetAllInventoryQuery>
{
  constructor(private dataSource: DataSource) {}

  async execute(query: GetAllInventoryQuery) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const sql = `
    SELECT
    id,
    name,
    country,
    district,
    address_detail as adressDetail,
    warehouse_id as warehouseId
    FROM
    inventory`;

    const ormInventories = await queryRunner.query(sql);
    if (ormInventories.length <= 0) {
      return [];
    }

    const inventories: InventoryDto[] = ormInventories.map(function (
      ormInventories,
    ) {
      const inventoriesDto = new InventoryDto();
      inventoriesDto.id = Number(ormInventories.id);
      inventoriesDto.description = ormInventories.description;
      inventoriesDto.country = ormInventories.country;
      inventoriesDto.district = ormInventories.district;
      inventoriesDto.addressDetail = ormInventories.addressDetail;
      inventoriesDto.warehouse = ormInventories.warehouseId;
      return inventoriesDto;
    });
    return inventories;
  }
}

@QueryHandler(GetInventoryByIdQuery)
export class GetInventoryByIdHandler
  implements IQueryHandler<GetInventoryByIdQuery>
{
  constructor(private dataSource: DataSource) {}

  async execute(query: GetInventoryByIdQuery) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const sql = `
    SELECT
    i.id,
    i.name,
    i.country,
    i.district,
    i.address_detail as adressDetail,
    i.warehouse_id as warehouseId
    FROM
    inventory i
    where i.id = ?
    `;

    const ormInventories = await queryRunner.query(sql, [query.inventoryId]);
    if (ormInventories.length <= 0) {
      return [];
    }

    const inventories: InventoryDto = ormInventories[0];
    const inventoriesDto = new InventoryDto();
    inventoriesDto.id = Number(inventories.id);
    inventoriesDto.description = inventories.description;
    inventoriesDto.country = inventories.country;
    inventoriesDto.district = inventories.district;
    inventoriesDto.addressDetail = inventories.addressDetail;
    inventoriesDto.warehouse = inventories.warehouse;

    return inventoriesDto;
  }
}
