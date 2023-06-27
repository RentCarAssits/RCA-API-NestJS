import { Body, Controller, Post, Res } from '@nestjs/common';
import { ServiceRequestService } from '../application/services/service-request.service';
import { QueryBus } from '@nestjs/cqrs';
import { ServiceRequestDto } from '../application/dto/request/service-request.dto';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Service Request')
@Controller('serviceRequest')
export class ServiceRequestController {
  constructor(
    private readonly serviceRequestService: ServiceRequestService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @Body() serviceRequestDto: ServiceRequestDto,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, ServiceRequestDto> =
        await this.serviceRequestService.create(serviceRequestDto);
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }

      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
