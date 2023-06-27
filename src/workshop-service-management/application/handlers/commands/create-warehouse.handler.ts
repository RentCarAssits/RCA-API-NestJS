import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWarehouseCommand } from '../../commands/create-warehouse.command';
import { Warehouse } from 'src/workshop-service-management/domain/entities/warehouse.entity';
import { Address } from '../../../domain/value-objects/address.value';
import { WarehouseFactory } from 'src/workshop-service-management/domain/factories/warehouse.factory';
import { WarehouseId } from 'src/workshop-service-management/domain/value-objects/warehouse-id.value';

@CommandHandler(CreateWarehouseCommand)
export class CreateWarehouseHandler
  implements ICommandHandler<CreateWarehouseCommand>
{
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateWarehouseCommand) {
    let warehouseId: number = 0;
    const name = command.name;
    const address = Address.create(
      command.country,
      command.district,
      command.addressDetail,
    );
    let warehouse: Warehouse = WarehouseFactory.createFrom(name, address);
    const aux = warehouse;
    const warehouseAux = this.warehouseRepository.create(aux);
    let warehouseTypeORM = await this.warehouseRepository.save(warehouseAux);
    if (warehouseTypeORM == null) {
      return warehouseId;
    }
    warehouseId = Number(warehouseTypeORM.getId());
    warehouseTypeORM.changeId(WarehouseId.of(warehouseId));
    warehouseTypeORM = this.publisher.mergeObjectContext(warehouseTypeORM);
    warehouseTypeORM.create();
    warehouseTypeORM.commit();
    return warehouseId;
  }
}
