import { Body, Controller, Post, Res, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { WorkshopService } from '../application/services/workshop.service';
import { CreateWorkshopDTO } from '../application/dto/request/create-workshop.dto';
import { WorkshopDTO } from '../application/dto/workshop.dto';

@ApiTags('Workshop')
@Controller('workshop')
export class WorkshopController {
  constructor(
    private readonly workshopService: WorkshopService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Workshop' })
  async create(
    @Body() createWorkshopDto: CreateWorkshopDTO,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, CreateWorkshopDTO> =
        await this.workshopService.create(createWorkshopDto);
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get('/mechanic/:id')
  async getById(
    @Param('id') mechanicId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const result: Result<AppNotification, WorkshopDTO[]> =
        await this.workshopService.findByMechanicId(mechanicId);
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
