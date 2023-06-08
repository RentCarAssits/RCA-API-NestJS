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

    //const warehouseId = await this.warehouseRepositroy.findOne(
    //  command.warehouseId,
    //);
    let inventory: Inventory = InventoryFactory.createFrom(name, address);
    let inventoryTypeORM = await this.inventoryRepository.save(inventory);
    if (inventoryTypeORM == null) {
      return inventoryId;
    }
    inventoryId = Number(inventory.getId());
    inventory.changeId(InventoryId.create(inventoryId));
    inventory = this.publisher.mergeObjectContext(inventory);
    inventory.create();
    inventory.commit();
    return inventory;
  }
}
