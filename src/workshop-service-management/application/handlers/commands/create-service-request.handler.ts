import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateServiceRequest } from '../../commands/create-service-request.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequest } from 'src/workshop-service-management/domain/entities/service-request.entity';
import { Repository } from 'typeorm';
import { VehicleIdFK } from 'src/workshop-service-management/domain/value-objects/vehicle-id-fk.value';
import { ServiceRequestFactory } from 'src/workshop-service-management/domain/factories/service-request.factory';
import { ServiceRequestId } from '../../../domain/value-objects/service-request-id.value';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Workshop } from 'src/workshop-service-management/domain/entities/workshop.entity';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';

@CommandHandler(CreateServiceRequest)
export class CreateServiceRequestHandler
  implements ICommandHandler<CreateServiceRequest>
{
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Workshop)
    private workshopRepository: Repository<Workshop>,

    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,

    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateServiceRequest): Promise<any> {
    let serviceRequestId = 0;
    const descriptionProblems: string = command.descriptionProblems;

    const ownerId: number = command.ownerId;
    const owner = await this.userRepository
      .createQueryBuilder()
      .where('user.id = :id', { id: ownerId })
      .getOne();
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const workshopId: number = command.workshopId;
    const workshop = await this.workshopRepository
      .createQueryBuilder()
      .where('workshop.id = :id', { id: workshopId })
      .getOne();
    if (!workshop) {
      throw new NotFoundException('Workshop not found');
    }

    const vehicleId: number = command.workshopId;
    const vehicle = await this.vehicleRepository
      .createQueryBuilder()
      .where('vehicle.id = :id', { id: vehicleId })
      .getOne();
    if (!workshop) {
      throw new NotFoundException('Vehicle not found');
    }

    let serviceRequestEntity: ServiceRequest =
      ServiceRequestFactory.createFrom(descriptionProblems);

    const aux = {
      ...serviceRequestEntity,
      workshop: workshop,
      owner: owner,
      vehicle: vehicle,
    };

    const serviceRequestAux = await this.serviceRequestRepository.create(aux);
    let serviceRequest = await this.serviceRequestRepository.save(
      serviceRequestAux,
    );
    if (serviceRequest === null) {
      return serviceRequestId;
    }

    serviceRequestId = Number(serviceRequest.getId());
    serviceRequest.changeId(ServiceRequestId.create(serviceRequestId));
    serviceRequest = this.publisher.mergeObjectContext(serviceRequest);
    serviceRequest.create();
    serviceRequest.commit();
    return serviceRequestId;
  }
}
