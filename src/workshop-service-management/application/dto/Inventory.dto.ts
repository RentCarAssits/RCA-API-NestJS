import { Warehouse } from 'src/workshop-service-management/domain/entities/warehouse.entity';

export class InventoryDto {
  public id: number;
  public description: string;
  public country: string;
  public district: string;
  public addressDetail: string;
  public warehouse: Warehouse;
}
