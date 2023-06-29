import { Body, Controller, Post, Res, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { CreateInventoryDTO } from '../application/dto/request/create-inventory.dto';
import { InventoryService } from '../application/services/inventory.service';
import { GetInventoryByIdQuery } from '../application/queries/get-inventory-by-id.query';
import { InventoryDto } from '../application/dto/inventory.dto';
import { ProductService } from '../application/services/product.service';
import { ProductDto } from '../application/dto/product.dto';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly productService: ProductService,
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
      const result: Result<AppNotification, InventoryDto[]> =
        await this.inventoryService.findAll();
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
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
      const result: Result<AppNotification, InventoryDto> =
        await this.inventoryService.findById(inventoryId);
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get('/:id/products')
  async getAllProductsById(
    @Param('id') inventoryId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const result: Result<AppNotification, ProductDto[]> =
        await this.productService.findAllProductsByInventoryId(inventoryId);
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
