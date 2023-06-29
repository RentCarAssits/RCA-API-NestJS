import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ServiceRequestService } from '../application/services/service-request.service';
import { QueryBus } from '@nestjs/cqrs';
import { CreateServiceRequestDto } from '../application/dto/request/service-request.dto';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { ApiTags } from '@nestjs/swagger';
import { ServiceRequestDto } from '../application/dto/service-request.dto';
import { GetServiceRequestVehiclesResponseDto } from '../application/dto/response/get-service-request-vehicles-response.dto';

@ApiTags('Service Request')
@Controller('serviceRequest')
export class ServiceRequestController {
  constructor(
    private readonly serviceRequestService: ServiceRequestService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @Body() serviceRequestDto: CreateServiceRequestDto,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, CreateServiceRequestDto> =
        await this.serviceRequestService.create(serviceRequestDto);
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }

      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
  @Get()
  async getAll(@Res({ passthrough: true }) response: any) {
    try {
      const result: Result<AppNotification, ServiceRequestDto[]> =
        await this.serviceRequestService.findAll();
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get('/:id')
  async getById(
    @Param('id') serviceRequestId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const result: Result<AppNotification, ServiceRequestDto> =
        await this.serviceRequestService.findbyId(serviceRequestId);
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get('/vehicle/all')
  async getVechicleByServiceRequest(@Res({ passthrough: true }) response: any) {
    try {
      const result: Result<
        AppNotification,
        GetServiceRequestVehiclesResponseDto[]
      > = await this.serviceRequestService.findAllVehiclesbyId();
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
