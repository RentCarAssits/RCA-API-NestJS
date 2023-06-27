import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentingOrderItem } from '../../domain/entities/renting-order-item.entity';
import { Repository } from 'typeorm';
import { CreateRentingOrderItemRequest } from '../requests/create-renting-order-item.request';
import { AppNotification } from '../../../shared/application/app.notification';
import { UpdateRentingOrderItemRequest } from '../requests/update-renting-order-item.request';

@Injectable()
export class UpdateRentingOrderItemValidator {
  constructor(
    @InjectRepository(RentingOrderItem)
    private rentingOrderItemRepository: Repository<RentingOrderItem>,
  ) {}

  public async validate(
    updateRentingOrderItemValidator: UpdateRentingOrderItemRequest,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const id: number = updateRentingOrderItemValidator.id;
    if (id === null || id < 0) {
      notification.addError('Id is necessary', null);
    }

    const state: string = updateRentingOrderItemValidator.state;
    if (state === null) {
      notification.addError('State is necessary', null);
    }

    if (notification.hasErrors()) {
      return notification;
    }

    return notification;
  }
}
