import { Body, Controller, Post, Res } from '@nestjs/common';
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

@ApiTags('Inventory')
@Controller('inventory')
export class WarehouseController {
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
}
