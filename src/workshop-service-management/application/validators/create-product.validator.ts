import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppNotification } from 'src/shared/application/app.notification';
import { Product } from 'src/workshop-service-management/domain/entities/product.entity';
import { CreateProductDto } from '../dto/request/create-product.dto';
import { Inventory } from 'src/workshop-service-management/domain/entities/inventory.entity';

@Injectable()
export class CreateProductValidator {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  public async validate(
    createProductDto: CreateProductDto,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const productName: string = createProductDto.productName;
    if (productName == null) {
      notification.addError('Product Name is required', null);
    }
    const quantity: number = createProductDto.quantity;
    if (quantity == null) {
      notification.addError('Quantity of price is required', null);
    }
    const quantityProduct: number = createProductDto.quantityProduct;
    if (quantityProduct == null) {
      notification.addError('Quantity of Product in is required', null);
    }
    const currency: string = createProductDto.currency;
    if (currency == null) {
      notification.addError('Currency of price is required', null);
    }

    const inventoryId: number = createProductDto.inventoryId;
    if (inventoryId == null) {
      notification.addError('Inventory Id is required', null);
    } else if (inventoryId <= 0) {
      notification.addError('Inventory Id is invalid ', null);
    } else {
      const inventory: Inventory = await this.inventoryRepository
        .createQueryBuilder()
        .where('id = :inventoryId', { inventoryId })
        .getOne();
      if (inventory == null) {
        notification.addError(
          'Inventory with the specified Id does not exist',
          null,
        );
      }
    }
    return notification;
  }
}
