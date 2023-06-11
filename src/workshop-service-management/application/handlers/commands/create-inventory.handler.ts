import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from 'src/workshop-service-management/domain/entities/warehouse.entity';
import { Address } from '../../../domain/value-objects/address.value';
import { CreateInventoryCommand } from '../../commands/create-inventory.command';
import { Inventory } from 'src/workshop-service-management/domain/entities/inventory.entity';
import { InventoryFactory } from 'src/workshop-service-management/domain/factories/inventory.factory';
import { InventoryId } from 'src/workshop-service-management/domain/value-objects/inventory-id.value';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { WarehouseId } from 'src/workshop-service-management/domain/value-objects/warehouse-id.value';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateInventoryCommand)
export class CreateInventoryHandler
  implements ICommandHandler<CreateInventoryCommand>
{
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,

    @InjectRepository(Warehouse)
    private warehouseRepositroy: Repository<Warehouse>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateInventoryCommand) {
    let inventoryId: number = 0;
    const name = command.description;
    const address = Address.create(
      command.country,
      command.district,
      command.addressDetail,
    );
    const warehouseId: number = command.warehouseId;
    const warehouse = await this.warehouseRepositroy
      .createQueryBuilder()
      .where('warehouse.id = :id', { id: warehouseId })
      .getOne();
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    let inventory: Inventory = InventoryFactory.createFrom(name, address);
    const aux = {
      ...inventory,
      warehouse: warehouse,
    };
    const inventoryAux = this.inventoryRepository.create(aux);
    let inventoryTypeORM = await this.inventoryRepository.save(inventoryAux);
    if (inventoryTypeORM == null) {
      return inventoryId;
    }
    inventoryId = Number(inventoryTypeORM.getId());
    inventoryTypeORM.changeId(InventoryId.create(inventoryId));
    inventoryTypeORM = this.publisher.mergeObjectContext(inventoryTypeORM);
    inventoryTypeORM.create();
    inventoryTypeORM.commit();
    return inventoryId;
  }
}
