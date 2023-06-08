import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { Result } from 'typescript-result';
import { QueryBus } from '@nestjs/cqrs';
import { RegisterVehicleRequest } from 'src/renting-management/application/requests/register-vehicle.request';
import { VehiclesApplicationService } from 'src/renting-management/application/services/vehicles-application.service';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { GetAllVehiclesQuery } from 'src/renting-management/application/queries/get-all-vehicles.query';
import { GetVehicleByIdQuery } from 'src/renting-management/application/queries/get-vehicle-by-id.query';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { Auth } from 'src/iam-management/application/decorators/auth.decorator';
import { RegisterVehicleResponse } from '../../application/responses/register-vehicle.response';
import { GetUser } from '../../../iam-management/application/decorators/get-user.decorator';
import { User } from '../../../iam-management/domain/entities/user.entity';
import { UpdateVehicleRequest } from '../../application/requests/update-vehicle.request';
import { GetAllVehiclesByYearQuery } from '../../application/queries/get-all-vehicles-by-year.query';
import { GetAllVehiclesByStarsQuery } from '../../application/queries/get-all-vehicles-by-stars.query';
import { GetVehiclesByOwnerIdQuery } from '../../application/queries/get-vehicles-by-ownerId.query';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesApplicationService: VehiclesApplicationService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'OK',
    type: RegisterVehicleResponse,
  })
  async register(
    @GetUser() owner: User,
    @Body() registerVehicleRequest: RegisterVehicleRequest,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const result: Result<AppNotification, RegisterVehicleResponse> =
        await this.vehiclesApplicationService.register(
          owner,
          registerVehicleRequest,
        );
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

  @Put(':id')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: Vehicle,
  })
  async update(
    @Param('id') id: number,
    @GetUser() owner: User,
    @Body() updateVehicleRequest: UpdateVehicleRequest,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const result: Result<AppNotification, RegisterVehicleResponse> =
        await this.vehiclesApplicationService.update(
          id,
          owner,
          updateVehicleRequest,
        );
      if (result.isSuccess()) {
        return ApiController.updated(response, result.value);
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
  async getAll(@Res({ passthrough: true }) response: any) {
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
  async getById(
    @Param('id') vehicleId: number,
    @Res({ passthrough: true }) response: any,
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

  @Get('/latest/vehicles')
  @Auth()
  async getByLatestYear(@Res({ passthrough: true }) response: any) {
    try {
      const vehicles = await this.queryBus.execute(
        new GetAllVehiclesByYearQuery(),
      );
      return ApiController.ok(response, vehicles);
    } catch (error) {
      console.log(
        '🚀 ~ file: vehicles.controller.ts:XX ~ VehiclesController ~ getByLatestYear ~ error:',
        error,
      );
      return ApiController.serverError(response, error);
    }
  }

  @Get('/stars/vehicles')
  @Auth()
  async getByMostStars(@Res({ passthrough: true }) response: any) {
    console.log('safafsafsafs');
    try {
      const vehicles = await this.queryBus.execute(
        new GetAllVehiclesByStarsQuery(),
      );
      return ApiController.ok(response, vehicles);
    } catch (error) {
      console.log(
        '🚀 ~ file: vehicles.controller.ts:XX ~ VehiclesController ~ getByLatestYear ~ error:',
        error,
      );
      return ApiController.serverError(response, error);
    }
  }

  @Get('/by/owner')
  @Auth()
  async getVehiclesByOwner(
    @GetUser() owner: User,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const vehicle = await this.queryBus.execute(
        new GetVehiclesByOwnerIdQuery(owner),
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

  ///by/owner
}
