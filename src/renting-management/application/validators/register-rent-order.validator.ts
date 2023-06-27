import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AppNotification } from '../../../shared/application/app.notification';
import { RegisterRentOrderRequest } from '../requests/register-rent-order.request';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { RentingOrderItem } from 'src/renting-management/domain/entities/renting-order-item.entity';

@Injectable()
export class RegisterRentOrderValidator {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RentingOrderItem)
    private rentingOrderItemRepository: Repository<RentingOrderItem>,
  ) {}

  public async validate(
    createRentOrderRequest: RegisterRentOrderRequest,
  ): Promise<AppNotification> {
    let notification: AppNotification = new AppNotification();

    const state: any = createRentOrderRequest.state;

    if (typeof state === 'undefined' || state == null) {
      notification.addError('Rent order state is required', null);
    }

    const renterId: number = createRentOrderRequest.renterId;
    if (typeof renterId === 'undefined' || renterId <= 0) {
      notification.addError(
        'Renter id is required and should be a positive number',
        null,
      );
    } else {
      const renter = await this.userRepository.findOneBy({
        id: renterId,
      } as FindOptionsWhere<User>);
      if (!renter) {
        notification.addError('Renter does not exist', null);
      }
    }

    const itemIds: number[] = createRentOrderRequest.itemIds;
    if (typeof itemIds === 'undefined' || itemIds.length == 0) {
      notification.addError('At least one item id is required', null);
    } else {
      for (const itemId of itemIds) {
        const item = await this.rentingOrderItemRepository.findOneBy({
          id: itemId,
        } as FindOptionsWhere<RentingOrderItem>);
        if (!item) {
          notification.addError(`Item with id ${itemId} does not exist`, null);
        }
      }
    }

    // Puedes agregar más validaciones si lo necesitas

    return notification;
  }
}
