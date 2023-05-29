import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Result } from 'typescript-result';
import { QueryBus } from '@nestjs/cqrs';
import { RegisterVehicleRequest } from 'src/renting-management/application/requests/register-vehicle.request';
import { VehiclesApplicationService } from 'src/renting-management/application/services/vehicles-application.service';
import { RegisterCategoryResponse } from 'src/renting-management/application/responses/register-category.response';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { GetAllVehiclesQuery } from 'src/renting-management/application/queries/get-all-vehicles.query';
import { GetVehicleByIdQuery } from 'src/renting-management/application/queries/get-vehicle-by-id.query';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';

@ApiTags('Products')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesApplicationService: VehiclesApplicationService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'OK',
    type: Vehicle,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbiden. Token Related' })
  @ApiResponse({ status: 500, description: 'Ups! Something Bad Happende' })
  async register(
    @Body() registerVehicleRequest: RegisterVehicleRequest,
    @Res({ passthrough: true }) response,
  ) {
    try {
      const result: Result<AppNotification, RegisterCategoryResponse> =
        await this.vehiclesApplicationService.register(registerVehicleRequest);
      if (result.isSuccess()) {
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

  @Get()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbiden. Token Related' })
  @ApiResponse({ status: 500, description: 'Ups! Something Bad Happende' })
  async getAll(@Res({ passthrough: true }) response) {
    try {
      const vehicles = await this.queryBus.execute(new GetAllVehiclesQuery());
      return ApiController.ok(response, vehicles);
    } catch (error) {
      console.log(
        '🚀 ~ file: vehicles.controller.ts:58 ~ VehiclesController ~ getAll ~ error:',
        error,
      );
      return ApiController.serverError(response, error);
    }
  }

  @Get('/:id')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbiden. Token Related' })
  @ApiResponse({ status: 500, description: 'Ups! Something Bad Happende' })
  async getById(
    @Param('id') vehicleId: number,
    @Res({ passthrough: true }) response,
  ) {
    try {
      const vehicle = await this.queryBus.execute(
        new GetVehicleByIdQuery(vehicleId),
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
}
