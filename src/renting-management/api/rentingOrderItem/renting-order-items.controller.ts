import { Controller, Post, Body, Res, Get, Param, Put } from '@nestjs/common';
import { Result } from 'typescript-result';
import { QueryBus } from '@nestjs/cqrs';
import { RentingOrderItemService } from '../../application/services/renting-order-item.service';
import { CreateRentingOrderItemRequest } from '../../application/requests/create-renting-order-item.request';
import { AppNotification } from '../../../shared/application/app.notification';
import { CreateRentingOrderItemResponse } from '../../application/responses/create-renting-order-item.response';
import { ApiController } from '../../../shared/api/api.controller';
import { GetAllRentingOrderItemsQuery } from '../../application/queries/get-all-renting-order-items.query';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../../iam-management/application/decorators/auth.decorator';
import { GetVehicleByIdQuery } from '../../application/queries/get-vehicle-by-id.query';
import { GetRentingOrderItemByIdQuery } from '../../application/queries/get-renting-order-item-by-id.query';
import { UpdateRentingOrderItemRequest } from '../../application/requests/update-renting-order-item.request';

@ApiTags('Renting-Order-Items')
@Controller('Renting-Order-Items')
export class RentingOrderItemsController {
  constructor(
    private readonly rentingOrderItemService: RentingOrderItemService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  @ApiResponse({ status: 500, description: 'Ups! Something Bad Happened' })
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
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  @ApiResponse({ status: 500, description: 'Ups! Something Bad Happened' })
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

  @Get('/:id')
  async getById(
    @Param('id') rentingOrderItemId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const vehicle = await this.queryBus.execute(
        new GetRentingOrderItemByIdQuery(rentingOrderItemId),
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

  @Put('/:id')
  async Update(
    @Body() updateRentingOrderItemRequest: UpdateRentingOrderItemRequest,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, UpdateRentingOrderItemRequest> =
        await this.rentingOrderItemService.update(
          updateRentingOrderItemRequest,
        );
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
