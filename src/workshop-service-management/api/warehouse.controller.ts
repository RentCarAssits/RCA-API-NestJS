import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { WarehouseService } from '../application/services/warehouse.service';
import { CreateWarehouseDTO } from '../application/dto/request/create-warehouse.dto';
import { InventoryDTO } from '../application/dto/inventory.dto';
import { InventoryService } from '../application/services/inventory.service';

@ApiTags('Warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly inventoryService: InventoryService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Warehouse' })
  async create(
    @Body() createWarehouseDto: CreateWarehouseDTO,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, CreateWarehouseDTO> =
        await this.warehouseService.create(createWarehouseDto);
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
  @Get('/:id/inventory')
  async getAllInventoryById(
    @Param('id') warehouseId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const result: Result<AppNotification, InventoryDTO[]> =
        await this.inventoryService.findAllInventoriesByWarehouseId(
          warehouseId,
        );
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
