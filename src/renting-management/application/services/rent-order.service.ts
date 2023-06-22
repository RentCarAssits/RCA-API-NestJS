import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from '../../../shared/application/app.notification';
import { RegisterRentOrder } from '../commands/register-rent-order.command';
import { RegisterRentOrderResponse } from '../responses/register-rent-order.response';
import { RegisterRentOrderValidator } from '../validators/register-rent-order.validator';
import { RegisterRentOrderRequest } from '../requests/register-rent-order.request';

@Injectable()
export class RentOrderService {
  constructor(
    private commandBus: CommandBus,
    private createRentOrderValidator: RegisterRentOrderValidator,
  ) {}

  async register(
    registerRentOrderRequest: RegisterRentOrderRequest,
  ): Promise<Result<AppNotification, RegisterRentOrderResponse>> {
    const notification: AppNotification =
      await this.createRentOrderValidator.validate(registerRentOrderRequest);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }

    const registerRentOrder: RegisterRentOrder = new RegisterRentOrder(
      registerRentOrderRequest.state,
      registerRentOrderRequest.renterId,
      registerRentOrderRequest.itemIds,
    );
    const rentOrderId: number = await this.commandBus.execute(
      registerRentOrder,
    );
    const registerRentOrderResponse: RegisterRentOrderResponse =
      new RegisterRentOrderResponse(
        rentOrderId,
        registerRentOrder.state,
        registerRentOrder.renterId,
        registerRentOrder.items,
      );
    return Result.ok(registerRentOrderResponse);
  }
}
