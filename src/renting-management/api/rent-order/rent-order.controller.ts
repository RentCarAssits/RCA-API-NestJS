import { Controller, Post, Body, Res, Get, Param, Put } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Auth } from 'src/iam-management/application/decorators/auth.decorator';
import { GetUser } from 'src/iam-management/application/decorators/get-user.decorator';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { ValidRoles } from 'src/iam-management/domain/interfaces/valid-roles';
import { GetRentOrdersByOwnerQuery } from 'src/renting-management/application/queries/get-rent-orders-by-owner.query';
import { GetRentOrdersByRenterQuery } from 'src/renting-management/application/queries/get-rent-orders-by-renter.query';

import { RegisterRentOrderRequest } from 'src/renting-management/application/requests/register-rent-order.request';
import { RegisterRentOrderResponse } from 'src/renting-management/application/responses/register-rent-order.response';
import { RentOrderService } from 'src/renting-management/application/services/rent-order.service';
import { ApiController } from 'src/shared/api/api.controller';
import { AppNotification } from 'src/shared/application/app.notification';
import { Result } from 'typescript-result';

@Controller('rent-order')
export class RentOrderController {
  constructor(
    private readonly rentOrderService: RentOrderService,
    private readonly queryBus: QueryBus,
  ) {}


  @Post()
  @Auth(ValidRoles.renter)
  async register(
    @Body() registerVehicleRequest: RegisterRentOrderRequest,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const result: Result<AppNotification, RegisterRentOrderResponse> =
        await this.rentOrderService.register(registerVehicleRequest);
      if (result.isSuccess()) {
        console.log(
          '🚀 ~ file: rent-order.controller.ts:29 ~ RentOrderController ~ result:',
          result,
        );
        return ApiController.created(response, result.value);

      }
      return ApiController.error(response, result.error.getErrors());

    } catch (error) {
      console.log(
        '🚀 ~ file: vehicles.controller.ts:44 ~ VehiclesController ~ error:',
        error,
      );
      return ApiController.serverError(response, error);

    }
  }


  @Get('/by/owner')
  @Auth(ValidRoles.owner)
  async getRentOrderByOwner(
    @GetUser() owner: User,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const vehicle = await this.queryBus.execute(
        new GetRentOrdersByOwnerQuery(owner),
      );
      return ApiController.ok(response, vehicle);
    } catch (error) {
      console.log(
        '🚀 ~ file: vehicles.controller.ts:77 ~ VehiclesController ~ error:',
        error,
      );
      return ApiController.serverError(response, error);
    }
  }


  @Get('/by/renter')
  @Auth(ValidRoles.renter)
  async getRentOrderByRenter(
    @GetUser() renter: User,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const rentOrders = await this.queryBus.execute(
        new GetRentOrdersByRenterQuery(renter),
      );
      return ApiController.ok(response, rentOrders);
    } catch (error) {
      console.log(
        '🚀 ~ file: rent-orders.controller.ts:77 ~ RentOrdersController ~ error:',
        error,
      );
      return ApiController.serverError(response, error);

    }

  }


}
