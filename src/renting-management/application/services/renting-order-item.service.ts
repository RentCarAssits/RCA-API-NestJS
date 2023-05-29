import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from '../../../shared/application/app.notification';
import { CreateRentingOrderItem } from '../commands/create-renting-order-item.command';
import { CreateRentingOrderItemRequest } from '../requests/create-renting-order-item.request';
import { CreateRentingOrderItemResponse } from '../responses/create-renting-order-item.response';
import { TimeUnit } from '../../domain/enums/TimeUnit';
import { CreateRentingOrderItemValidator } from '../validators/create-renting-order-item.validator';

@Injectable()
export class RentingOrderItemService {
  constructor(
    private commandBus: CommandBus,
    private createRentingOrderItemValidator: CreateRentingOrderItemValidator,
  ) {}

  async register(
    createRentingOrderItemRequest: CreateRentingOrderItemRequest,
  ): Promise<Result<AppNotification, CreateRentingOrderItemResponse>> {
    const notification: AppNotification =
      await this.createRentingOrderItemValidator.validate(
        createRentingOrderItemRequest,
      );
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const createRentingOrderItem: CreateRentingOrderItem =
      new CreateRentingOrderItem(
        createRentingOrderItemRequest.rentingPrice,
        createRentingOrderItemRequest.currency,
        createRentingOrderItemRequest.startDate,
        createRentingOrderItemRequest.endDate,
        createRentingOrderItemRequest.vehicleId,
        createRentingOrderItemRequest.rentingUnit,
      );
    const rentingOrderItemId: number = await this.commandBus.execute(
      createRentingOrderItem,
    );
    const createRentingOrderItemResponse: CreateRentingOrderItemResponse =
      new CreateRentingOrderItemResponse(
        rentingOrderItemId,
        createRentingOrderItem.rentingPrice,
        createRentingOrderItem.currency,
        createRentingOrderItem.startDate,
        createRentingOrderItem.endDate,
        createRentingOrderItem.vehicleId,
        createRentingOrderItem.rentingUnit,
      );
    return Result.ok(createRentingOrderItemResponse);
  }
}
