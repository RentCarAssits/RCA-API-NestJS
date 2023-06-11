import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppNotification } from 'src/shared/application/app.notification';
import { Warehouse } from 'src/workshop-service-management/domain/entities/warehouse.entity';
import { CreateWarehouseDTO } from '../dto/request/create-warehouse.dto';
import { Inventory } from 'src/workshop-service-management/domain/entities/inventory.entity';
import { CreateInventoryDTO } from '../dto/request/create-inventory.dto';

@Injectable()
export class CreateInventoryValidator {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  public async validate(
    createInventoryDto: CreateInventoryDTO,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const description: string = createInventoryDto.description;
    if (description == null) {
      notification.addError('Description is required', null);
    }
    const country: string = createInventoryDto.country;
    if (country == null) {
      notification.addError('Country is required', null);
    }
    const district: string = createInventoryDto.district;
    if (district == null) {
      notification.addError('District is required', null);
    }
    const addressDetail: string = createInventoryDto.addressDetail;
    if (addressDetail == null) {
      notification.addError('Address Detail is required', null);
    }
    const warehouseId: number = createInventoryDto.warehouseId || 0;

    if (warehouseId <= 0) {
      notification.addError('Invalid owner Id', null);
    }
    const existingWarehouse: Warehouse = await this.warehouseRepository
      .createQueryBuilder()
      .where('id = :warehouseId', { warehouseId })
      .getOne();

    if (!existingWarehouse) {
      notification.addError(
        'Warehouse with the specified Id does not exist',
        null,
      );
    }
    return notification;
  }
}
