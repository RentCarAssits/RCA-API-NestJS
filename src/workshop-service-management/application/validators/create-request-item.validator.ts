import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequest } from 'src/workshop-service-management/domain/entities/service-request.entity';
import { Repository } from 'typeorm';
import { ServiceRequestDto } from '../dto/request/service-request.dto';
import { AppNotification } from 'src/shared/application/app.notification';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { Workshop } from 'src/workshop-service-management/domain/entities/workshop.entity';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { CreateRequestItemDto } from '../dto/request/create-request-item.dto';
import { ServiceItem } from 'src/workshop-service-management/domain/entities/service-item.entity';
import { Product } from 'src/workshop-service-management/domain/entities/product.entity';

@Injectable()
export class CreateRequestItemValidator {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(ServiceItem)
    private serviceItemRepository: Repository<ServiceItem>,
    @InjectRepository(Vehicle)
    private vechicleRepository: Repository<Vehicle>,
  ) {}

  public async validate(
    createRequestItemDto: CreateRequestItemDto,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const quantityRequestItem: number =
      createRequestItemDto.quantityRequestItem;
    if (quantityRequestItem === null) {
      notification.addError('Quantity RequestItem  is required', null);
    }
    const amount: number = createRequestItemDto.amount;
    if (amount == null) {
      notification.addError('Amount is required', null);
    }
    const currency: string = createRequestItemDto.currency;
    if (currency == null) {
      notification.addError('Currency is required', null);
    }
    const serviceItemId: number = createRequestItemDto.serviceItemId;
    if (serviceItemId == null) {
      notification.addError('Service Item Id is required', null);
    } else if (serviceItemId <= 0) {
      notification.addError('Service Item Id is invalid ', null);
    } else {
      const serviceItem: ServiceItem = await this.serviceItemRepository
        .createQueryBuilder()
        .where('id = :serviceItemId', { serviceItemId })
        .getOne();
      if (serviceItem == null) {
        notification.addError(
          'Service Item with the specified Id does not exist',
          null,
        );
      }
    }

    const productId: number = createRequestItemDto.productId;
    if (productId == null) {
      notification.addError('Product id is required', null);
    } else if (productId <= 0) {
      notification.addError('Product Id is invalid ', null);
    } else {
      const product: Product = await this.productRepository
        .createQueryBuilder()
        .where('id = :productId', { productId })
        .getOne();
      if (product == null) {
        notification.addError(
          'Product with the specified Id does not exist',
          null,
        );
      }
    }

    return notification;
  }
}
