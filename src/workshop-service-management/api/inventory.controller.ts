import { Body, Controller, Post, Res, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProposalService } from '../application/services/proposal.service';
import { QueryBus } from '@nestjs/cqrs';
import { CreateProposalDto } from '../application/dto/request/create-proposal.dto';
import { response } from 'express';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { WarehouseService } from '../application/services/warehouse.service';
import { CreateWarehouseDTO } from '../application/dto/request/create-warehouse.dto';
import { CreateInventoryDTO } from '../application/dto/request/create-inventory.dto';
import { InventoryService } from '../application/services/inventory.service';
import { GetAllInventoryQuery } from '../application/queries/get-all-inventory.query';
import { GetInventoryByIdQuery } from '../application/queries/get-inventory-by-id.query';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Inventory' })
  async create(
    @Body() createInventoryDto: CreateInventoryDTO,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, CreateInventoryDTO> =
        await this.inventoryService.create(createInventoryDto);
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
      const inventories = await this.queryBus.execute(
        new GetAllInventoryQuery(),
      );
      return ApiController.ok(response, inventories);
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get('/:id')
  async getById(
    @Param('id') inventoryId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const vehicle = await this.queryBus.execute(
        new GetInventoryByIdQuery(inventoryId),
      );
      return ApiController.ok(response, vehicle);
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
