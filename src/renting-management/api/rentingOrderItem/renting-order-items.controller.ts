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
import { GetUser } from '../../../iam-management/application/decorators/get-user.decorator';
import { User } from '../../../iam-management/domain/entities/user.entity';
import { GetRentingItemsByVehiclesRequest } from '../../application/requests/get-renting-items-by-vehicles.request';
import { GetAllRentingItemsByVehicleQuery } from '../../application/queries/get-all-renting-items-by-vehicle.query';
import { GetAllRentingItemsByRenterIdQuery } from '../../application/queries/get-all-renting-items-by-renter-id.query';
import { GetAllAcceptedRentingItemsByRenterIdQuery } from '../../application/queries/get-all-accepted-renting-items-by-renter-id.query';
import { ValidRoles } from 'src/iam-management/domain/interfaces/valid-roles';

@ApiTags('Renting-Order-Items')
@Controller('Renting-Order-Items')
export class RentingOrderItemsController {
  constructor(
    private readonly rentingOrderItemService: RentingOrderItemService,
    private readonly queryBus: QueryBus,
  ) {}


  @Post()
  @Auth(ValidRoles.renter)
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  @ApiResponse({ status: 500, description: 'Ups! Something Bad Happened' })
  async create(
    @GetUser() requester: User,
    @Body() registerProductRequest: CreateRentingOrderItemRequest,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, CreateRentingOrderItemResponse> =
        await this.rentingOrderItemService.register(
          requester,
          registerProductRequest,
        );
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
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  @ApiResponse({ status: 500, description: 'Ups! Something Bad Happened' })
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
        '🚀 ~ file: rentingOrderItems.controller.ts:77 ~ rentingOrderItems ~ error:',
        error,
      );
      return ApiController.serverError(response, error);
    }

  }
  @Get('get-by-renter-id/:id')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  @ApiResponse({ status: 500, description: 'Ups! Something Bad Happened' })
  async getByRenterId(
    @Param('id') renterId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const vehicle = await this.queryBus.execute(
        new GetAllRentingItemsByRenterIdQuery(renterId),
      );
      return ApiController.ok(response, vehicle);
    } catch (error) {
      console.log(
        '🚀 ~ file: rentingOrderItems.controller.ts:77 ~ rentingOrderItems ~ error:',
        error,
      );
      return ApiController.serverError(response, error);

    }
  }
  @Get('get-all-accepted-by-renter-id/:id')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  @ApiResponse({ status: 500, description: 'Ups! Something Bad Happened' })
  async getAllAcceptedByRenterId(
    @Param('id') renterId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const vehicle = await this.queryBus.execute(
        new GetAllAcceptedRentingItemsByRenterIdQuery(renterId),
      );
      return ApiController.ok(response, vehicle);
    } catch (error) {
      console.log(
        '🚀 ~ file: rentingOrderItems.controller.ts:77 ~ rentingOrderItems ~ error:',
        error,
      );
      return ApiController.serverError(response, error);

    }
  }
  @Post('/get-by-vehicles')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  @ApiResponse({ status: 500, description: 'Ups! Something Bad Happened' })
  async GetByVehicles(
    @Body() vehiclesIdRequest: GetRentingItemsByVehiclesRequest,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const vehicle = await this.queryBus.execute(
        new GetAllRentingItemsByVehicleQuery(vehiclesIdRequest.vehiclesId),
      );
      return ApiController.ok(response, vehicle);

    } catch (error) {
      console.log(
        '🚀 ~ file: rentingOrderItems.controller.ts:77 ~ rentingOrderItems ~ error:',
        error,
      );
      return ApiController.serverError(response, error);

    }
  }



  @Put('/:id')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  @ApiResponse({ status: 500, description: 'Ups! Something Bad Happened' })
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
