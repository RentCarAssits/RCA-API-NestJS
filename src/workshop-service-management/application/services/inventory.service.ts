import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateInventoryValidator } from '../validators/create-inventory.validator';
import { CreateInventoryDTO } from '../dto/request/create-inventory.dto';
import { CreateInventoryCommand } from '../commands/create-inventory.command';
import { CreateInventoryResponseDTO } from '../dto/response/create-inventory-response.dto';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Inventory } from 'src/workshop-service-management/domain/entities/inventory.entity';
import { InventoryDTO } from '../dto/inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from 'src/workshop-service-management/domain/entities/warehouse.entity';
import { WarehouseId } from '../../domain/value-objects/warehouse-id.value';

@Injectable()
export class InventoryService {
  constructor(
    private commandBus: CommandBus,
    private createInventoryValidator: CreateInventoryValidator,

    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,

    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
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

  async findAll(): Promise<Result<AppNotification, InventoryDTO[]>> {
    const inventory = await this.inventoryRepository.find({
      relations: ['warehouse'],
    });

    const inventoryDtos: InventoryDTO[] = inventory.map((inventory) => {
      const inventoryDto = new InventoryDTO();
      inventoryDto.id = Number(inventory.getId());
      inventoryDto.description = inventory.getDescription();
      inventoryDto.country = inventory.getAddress().getCountry();
      inventoryDto.district = inventory.getAddress().getDitrict();
      inventoryDto.addressDetail = inventory.getAddress().getAddressDetail();
      inventoryDto.warehouse = inventory.getWarehouse();
      return inventoryDto;
    });
    return Result.ok(inventoryDtos);
  }
  async findById(
    inventoryId: Number,
  ): Promise<Result<AppNotification, InventoryDTO>> {
    const inventory = await this.inventoryRepository.findOne({
      relations: ['warehouse'],
      where: {
        id: inventoryId,
      } as FindOptionsWhere<Inventory>,
    });

    const inventoryDto = new InventoryDTO();
    inventoryDto.id = Number(inventory.getId());
    inventoryDto.description = inventory.getDescription();
    inventoryDto.country = inventory.getAddress().getCountry();
    inventoryDto.district = inventory.getAddress().getDitrict();
    inventoryDto.addressDetail = inventory.getAddress().getAddressDetail();
    inventoryDto.warehouse = inventory.getWarehouse();

    return Result.ok(inventoryDto);
  }
  async findAllInventoriesByWarehouseId(
    warehouseId: number,
  ): Promise<Result<AppNotification, InventoryDTO[]>> {
    const warehouse = await this.warehouseRepository.findOne({
      where: {
        id: WarehouseId.of(warehouseId),
      } as FindOptionsWhere<Warehouse>,
    });
    const inventory = await this.inventoryRepository.find({
      where: {
        warehouse: warehouse,
      } as FindOptionsWhere<Inventory>,
    });

    const inventoryDtos: InventoryDTO[] = inventory.map((inventory) => {
      const inventoryDto = new InventoryDTO();
      inventoryDto.id = Number(inventory.getId());
      inventoryDto.description = inventory.getDescription();
      inventoryDto.country = inventory.getAddress().getCountry();
      inventoryDto.district = inventory.getAddress().getDitrict();
      inventoryDto.addressDetail = inventory.getAddress().getAddressDetail();
      inventoryDto.warehouse = inventory.getWarehouse();
      return inventoryDto;
    });
    return Result.ok(inventoryDtos);
  }
}
