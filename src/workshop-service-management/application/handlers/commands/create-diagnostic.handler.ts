import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateDiagnosticDTO } from '../../dto/request/create-diagnostic.dto';
import { Diagnostic } from 'src/workshop-service-management/domain/entities/diagnostic.entity';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { DiagnosticFactory } from 'src/workshop-service-management/domain/factories/diagnostic.factory';
import { DiagnosticId } from 'src/workshop-service-management/domain/value-objects/diagnostic-id.value';
import { CreateDiagnosticCommand } from '../../commands/create-diagnostic.command';
import { OwnerId } from '../../../domain/value-objects/owner-id.value';
import { VehicleId } from '../../../domain/value-objects/vehicle-id.value';
import { MechanicId } from '../../../domain/value-objects/mechanic-id.value';

@CommandHandler(CreateDiagnosticCommand)
export class CreateDiagnostictHandler
  implements ICommandHandler<CreateDiagnosticCommand>
{
  constructor(
    @InjectRepository(Diagnostic)
    private diagnosticRepository: Repository<Diagnostic>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,

    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateDiagnosticCommand): Promise<any> {
    let diagnosticId = 0;
    const diagnosticDescription: string = command.diagnosticDescription;

    const ownerId: number = command.ownerId;
    const owner = await this.userRepository
      .createQueryBuilder()
      .where('user.id = :id', { id: ownerId })
      .getOne();
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const mechanicId: number = command.mechanicId;
    const mechanic = await this.userRepository
      .createQueryBuilder()
      .where('user.id = :id', { id: mechanicId })
      .getOne();
    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }

    const vehicleId: number = command.vehicleId;
    const vehicle = await this.vehicleRepository
      .createQueryBuilder()
      .where('vehicle.id = :id', { id: vehicleId })
      .getOne();
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    let diagnosticEntity: Diagnostic = DiagnosticFactory.createFrom(
      diagnosticDescription,
    );

    const aux = {
      ...diagnosticEntity,
      owner: OwnerId.of(ownerId),
      vehicle: VehicleId.of(vehicleId),
      mechanic: MechanicId.of(mechanicId),
    };

    const diagnosticAux = await this.diagnosticRepository.create(aux);
    let diagnosticTypeORM = await this.diagnosticRepository.save(diagnosticAux);
    if (diagnosticTypeORM === null) {
      return diagnosticId;
    }

    diagnosticId = Number(diagnosticTypeORM.getId());
    diagnosticTypeORM.changeId(DiagnosticId.create(diagnosticId));
    diagnosticTypeORM = this.publisher.mergeObjectContext(diagnosticTypeORM);
    diagnosticTypeORM.create();
    diagnosticTypeORM.commit();
    return diagnosticId;
  }
}
