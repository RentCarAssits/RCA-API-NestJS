import { Body, Controller, Post, Res, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { GetInventoryByIdQuery } from '../application/queries/get-inventory-by-id.query';
import { DiagnosticService } from '../application/services/diagnostic.service';
import { CreateDiagnosticDTO } from '../application/dto/request/create-diagnostic.dto';
import { DiagnosticDto } from '../application/dto/diagnostic.dto';

@ApiTags('Diagnostic')
@Controller('diagnostic')
export class DiagnosticController {
  constructor(
    private readonly diagnosticService: DiagnosticService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Diagnostic' })
  async create(
    @Body() createDiagnosticDto: CreateDiagnosticDTO,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, CreateDiagnosticDTO> =
        await this.diagnosticService.create(createDiagnosticDto);
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
      const result: Result<AppNotification, DiagnosticDto[]> =
        await this.diagnosticService.findAll();
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get('/:id')
  async getById(
    @Param('id') diagnosticId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const result: Result<AppNotification, DiagnosticDto> =
        await this.diagnosticService.findbyId(diagnosticId);
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
