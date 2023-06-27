import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppNotification } from 'src/shared/application/app.notification';
import { Warehouse } from 'src/workshop-service-management/domain/entities/warehouse.entity';
import { CreateWarehouseDTO } from '../dto/request/create-warehouse.dto';

@Injectable()
export class CreateWarehouseValidator {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  public async validate(
    createWarehouseDto: CreateWarehouseDTO,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const name: string = createWarehouseDto.name;
    if (name == null) {
      notification.addError('Name is required', null);
    }
    const country: string = createWarehouseDto.country;
    if (country == null) {
      notification.addError('Country is required', null);
    }
    const district: string = createWarehouseDto.district;
    if (district == null) {
      notification.addError('District is required', null);
    }
    const addressDetail: string = createWarehouseDto.addressDetail;
    if (addressDetail == null) {
      notification.addError('Address Detail is required', null);
    }

    return notification;
  }
}
