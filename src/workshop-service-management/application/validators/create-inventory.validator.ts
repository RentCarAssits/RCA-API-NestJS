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

    return notification;
  }
}
