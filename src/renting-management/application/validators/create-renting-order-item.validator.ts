import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppNotification } from '../../../shared/application/app.notification';
import { RentingOrderItem } from '../../domain/entities/renting-order-item.entity';
import { CreateRentingOrderItemRequest } from '../requests/create-renting-order-item.request';
import { User } from '../../../iam-management/domain/entities/user.entity';

@Injectable()
export class CreateRentingOrderItemValidator {
  constructor(
    @InjectRepository(RentingOrderItem)
    private rentingOrderItemRepository: Repository<RentingOrderItem>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async validate(
    createRentingOrderItemRequest: CreateRentingOrderItemRequest,
    owner: User,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const rentingPrice: number = createRentingOrderItemRequest.rentingPrice;
    if (rentingPrice <= 0 || rentingPrice == null) {
      notification.addError(
        'Price Is Necessary and should be more than 0',
        null,
      );
    }
    const currency: string = createRentingOrderItemRequest.currency.trim();
    if (currency.length <= 0) {
      notification.addError('Currency is required', null);
    }
    const ownerId: number = owner.id || 0;

    if (ownerId <= 0) {
      notification.addError('Invalid owner Id', null);
    }

    const existingUser: User = await this.userRepository
      .createQueryBuilder()
      .where('id = :ownerId', { ownerId })
      .getOne();

    if (!existingUser) {
      notification.addError(
        'User with the specified owner Id does not exist',
        null,
      );
    }
    if (notification.hasErrors()) {
      return notification;
    }
    /*const rentingOrderItem: RentingOrderItem =
      await this.rentingOrderItemRepository
        .createQueryBuilder()
        .where('id = :id', { id })
        .getOne();
    if (rentingOrderItem != null) {
      notification.addError('Renting Order is taken', null);
    }*/
    return notification;
  }
}
