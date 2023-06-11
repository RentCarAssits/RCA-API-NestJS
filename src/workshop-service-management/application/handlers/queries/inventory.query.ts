import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllInventoryQuery } from '../../queries/get-all-inventory.query';
import { DataSource, getManager } from 'typeorm';
import { InventoryDTO } from '../../dto/Inventory.dto';

@QueryHandler(GetAllInventoryQuery)
export class GetPatientsHandler implements IQueryHandler<GetAllInventoryQuery> {
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

    const inventories: InventoryDTO[] = ormInventories.map(function (
      ormInventories,
    ) {
      const inventoriesDto = new InventoryDTO();
      inventoriesDto.id = Number(ormInventories.id);
      inventoriesDto.description = ormInventories.description;
      inventoriesDto.country = ormInventories.country;
      inventoriesDto.district = ormInventories.district;
      inventoriesDto.addressDetail = ormInventories.addressDetail;
      inventoriesDto.warehouseId = ormInventories.warehouseId;
      return inventoriesDto;
    });
    return inventories;
  }
}
