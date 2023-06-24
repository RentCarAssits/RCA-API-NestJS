import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWarehouseCommand } from '../../commands/create-warehouse.command';
import { Warehouse } from 'src/workshop-service-management/domain/entities/warehouse.entity';
import { Address } from '../../../domain/value-objects/address.value';
import { WarehouseFactory } from 'src/workshop-service-management/domain/factories/warehouse.factory';
import { WarehouseId } from 'src/workshop-service-management/domain/value-objects/warehouse-id.value';
import { CreateWorkshopCommand } from '../../commands/create-workshop.command';
import { Workshop } from 'src/workshop-service-management/domain/entities/workshop.entity';
import { WorkshopFactory } from 'src/workshop-service-management/domain/factories/workshop.factory';
import { WorkshopId } from '../../../domain/value-objects/workshop-id.value';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { MechanicId } from 'src/workshop-service-management/domain/value-objects/mechanic-id.value';

@CommandHandler(CreateWorkshopCommand)
export class CreateWorkshopHandler
  implements ICommandHandler<CreateWorkshopCommand>
{
  constructor(
    @InjectRepository(Workshop)
    private workshopRepository: Repository<Workshop>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateWorkshopCommand) {
    let workshopId: number = 0;
    const name = command.name;
    const address = Address.create(
      command.country,
      command.district,
      command.addressDetail,
    );
    const mechanicId: number = command.mechanicId;
    const mechanic = await this.userRepository
      .createQueryBuilder()
      .where('user.id = :id', { id: mechanicId })
      .getOne();
    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }
    let workshop: Workshop = WorkshopFactory.createFrom(name, address);
    const aux = {
      ...workshop,
      mechanic: MechanicId.of(mechanicId),
    };
    const workshopAux = this.workshopRepository.create(aux);
    let workshopTypeORM = await this.workshopRepository.save(workshopAux);
    if (workshopTypeORM == null) {
      return workshopId;
    }
    workshopId = Number(workshopTypeORM.getId());
    workshopTypeORM.changeId(WorkshopId.of(workshopId));
    workshopTypeORM = this.publisher.mergeObjectContext(workshopTypeORM);
    workshopTypeORM.create();
    workshopTypeORM.commit();
    return workshopId;
  }
}
