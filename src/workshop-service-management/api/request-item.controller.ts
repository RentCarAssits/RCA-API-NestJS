import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { RequestItemService } from '../application/services/request-item.service';
import { CreateRequestItemDto } from '../application/dto/request/create-request-item.dto';

@ApiTags('Request Item')
@Controller('requestItem')
export class RequestItemController {
  constructor(
    private readonly requestItemService: RequestItemService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Request Item' })
  async create(
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
