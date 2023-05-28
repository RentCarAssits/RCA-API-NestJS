import { Controller, Post, Body, Res, Get, Param } from '@nestjs/common';
import { Result } from 'typescript-result';
import { QueryBus } from '@nestjs/cqrs';
import { RentingOrderItemService } from '../application/services/renting-order-item.service';
import { CreateRentingOrderItemRequest } from '../application/requests/create-renting-order-item.request';
import { AppNotification } from '../../shared/application/app.notification';
import { CreateRentingOrderItemResponse } from '../application/responses/create-renting-order-item.response';
import { ApiController } from '../../shared/api/api.controller';
import { GetAllRentingOrderItemsQuery } from '../application/queries/get-all-renting-order-items.query';

@Controller('Renting-Order-Items')
export class RentingOrderItemsController {
  constructor(
    private readonly rentingOrderItemService: RentingOrderItemService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @Body() registerProductRequest: CreateRentingOrderItemRequest,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, CreateRentingOrderItemResponse> =
        await this.rentingOrderItemService.register(registerProductRequest);
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get()
  async getAll(@Res({ passthrough: true }) response): Promise<object> {
    try {
      const rentingItems = await this.queryBus.execute(
        new GetAllRentingOrderItemsQuery(),
      );
      return ApiController.ok(response, rentingItems);
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
