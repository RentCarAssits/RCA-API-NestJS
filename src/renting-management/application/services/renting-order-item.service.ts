import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from '../../../shared/application/app.notification';
import { CreateRentingOrderItem } from '../commands/create-renting-order-item.command';
import { CreateRentingOrderItemRequest } from '../requests/create-renting-order-item.request';
import { CreateRentingOrderItemResponse } from '../responses/create-renting-order-item.response';
import { TimeUnit } from '../../domain/enums/TimeUnit';
import { CreateRentingOrderItemValidator } from '../validators/create-renting-order-item.validator';
import { UpdateRentingOrderItemValidator } from '../validators/update-renting-order-item.validator';
import { UpdateRentingOrderItemRequest } from '../requests/update-renting-order-item.request';
import { UpdateRentingOrderItemCommand } from '../commands/update-renting-order-item.command';
import { UpdateRentingOrderItemResponse } from '../responses/update-renting-order-item.response';
import { User } from '../../../iam-management/domain/entities/user.entity';

@Injectable()
export class RentingOrderItemService {
  constructor(
    private commandBus: CommandBus,
    private createRentingOrderItemValidator: CreateRentingOrderItemValidator,
    private updateRentingOrderItemValidator: UpdateRentingOrderItemValidator,
  ) {}

  async register(
    requester: User,
    createRentingOrderItemRequest: CreateRentingOrderItemRequest,
  ): Promise<Result<AppNotification, CreateRentingOrderItemResponse>> {
    const notification: AppNotification =
      await this.createRentingOrderItemValidator.validate(
        createRentingOrderItemRequest,
        requester,
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
        requester.id,
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

  async update(
    updateRentingOrderItemRequest: UpdateRentingOrderItemRequest,
  ): Promise<Result<AppNotification, UpdateRentingOrderItemResponse>> {
    const notification: AppNotification =
      await this.updateRentingOrderItemValidator.validate(
        updateRentingOrderItemRequest,
      );
    if (notification.hasErrors()) {
      return Result.error(notification);
    }

    const updateRentingOrderItemCommand: UpdateRentingOrderItemCommand =
      new UpdateRentingOrderItemCommand(
        updateRentingOrderItemRequest.id,
        updateRentingOrderItemRequest.state,
      );
    const rentingOrderItemId: number = await this.commandBus.execute(
      updateRentingOrderItemCommand,
    );

    const updateRentingOrderItemResponse: UpdateRentingOrderItemResponse =
      new UpdateRentingOrderItemResponse(
        rentingOrderItemId,
        updateRentingOrderItemCommand.state,
      );
    return Result.ok(updateRentingOrderItemResponse);
  }
}
