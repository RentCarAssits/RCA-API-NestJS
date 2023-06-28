import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { RequestItemService } from '../application/services/request-item.service';
import { CreateRequestItemDto } from '../application/dto/request/create-request-item.dto';
import { ServiceItemService } from '../application/services/service-item.service';
import { CreateServiceItemDto } from '../application/dto/request/create-service-item.dto';

@ApiTags('Service Item')
@Controller('proposal')
export class ServiceItemController {
  constructor(
    private readonly serviceItemService: ServiceItemService,
    private readonly requestItemService: RequestItemService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/:id/serviceItem')
  @ApiOperation({ summary: 'Create Service Item' })
  async create(
    @Param('id') proposalId: number,
    @Body() createServiceItemDto: CreateServiceItemDto,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, CreateServiceItemDto> =
        await this.serviceItemService.create(createServiceItemDto);
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
  @Post('/:id/serviceItem/:idRequestItem/requestItem')
  @ApiOperation({ summary: 'Create Service Item' })
  async createRequest(
    @Param('id') proposalId: number,
    @Param('idRequestItem') idRequestItem: number,
    @Body() createRequestItemDto: CreateRequestItemDto,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, CreateRequestItemDto> =
        await this.requestItemService.create(createRequestItemDto);
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
