import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateWarehouseValidator } from '../validators/create-warehouse.validator';
import { CreateWarehouseDTO } from '../dto/request/create-warehouse.dto';
import { CreateWarehouseCommand } from '../commands/create-warehouse.command';
import { CreateWarehouseResponseDTO } from '../dto/response/create-warehouse-response.dto';
import { CreateInventoryValidator } from '../validators/create-inventory.validator';
import { CreateInventoryDTO } from '../dto/request/create-inventory.dto';
import { CreateInventoryCommand } from '../commands/create-inventory.command';
import { CreateInventoryResponseDTO } from '../dto/response/create-inventory-response.dto';

@Injectable()
export class InventoryService {
  constructor(
    private commandBus: CommandBus,
    private createInventoryValidator: CreateInventoryValidator,
  ) {}
  async create(
    createInventoryDto: CreateInventoryDTO,
  ): Promise<Result<AppNotification, CreateInventoryDTO>> {
    const notification: AppNotification =
      await this.createInventoryValidator.validate(createInventoryDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const createInventoryCommand: CreateInventoryCommand =
      new CreateInventoryCommand(
        createInventoryDto.description,
        createInventoryDto.country,
        createInventoryDto.district,
        createInventoryDto.addressDetail,
        createInventoryDto.warehouseId,
      );
    const inventoryId = await this.commandBus.execute(createInventoryCommand);
    const createInventoryResponseDto: CreateInventoryResponseDTO =
      new CreateInventoryResponseDTO(
        inventoryId,
        createInventoryDto.description,
        createInventoryDto.country,
        createInventoryDto.district,
        createInventoryDto.addressDetail,
        createInventoryDto.warehouseId,
      );
    return Result.ok(createInventoryResponseDto);
  }
}
