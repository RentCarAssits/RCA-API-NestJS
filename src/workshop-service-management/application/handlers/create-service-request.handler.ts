import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateServiceRequest } from '../commands/create-service-request.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequest } from 'src/workshop-service-management/domain/entities/service-request.entity';
import { Repository } from 'typeorm';
import { WorkshopIdFK } from 'src/workshop-service-management/domain/value-objects/workshop-id-fk.value';
import { OwnerIdFK } from 'src/workshop-service-management/domain/value-objects/owner-id-fk.value';
import { VehicleIdFK } from 'src/workshop-service-management/domain/value-objects/vehicle-id-fk.value';
import { ServiceRequestFactory } from 'src/workshop-service-management/domain/factory/service-request-factory.factory';
import { ServiceRequestId } from '../../domain/value-objects/service-request-id.value';

@CommandHandler(CreateServiceRequest)
export class CreateServiceRequestHandler
  implements ICommandHandler<CreateServiceRequest>
{
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateServiceRequest): Promise<any> {
    let serviceRequestId = 0;
    const descriptionProblems: string = command.descriptionProblems;
    const workshopId: WorkshopIdFK = WorkshopIdFK.of(command.workshopId);
    const ownerId: OwnerIdFK = OwnerIdFK.of(command.ownerId);
    const vehicleId: VehicleIdFK = VehicleIdFK.of(command.vehicleId);

    let serviceRequestEntity: ServiceRequest = ServiceRequestFactory.createFrom(
      descriptionProblems,
      workshopId,
      vehicleId,
      ownerId,
    );

    const serviceRequest = await this.serviceRequestRepository.save(
      serviceRequestEntity,
    );

    if (serviceRequest === null) {
      return serviceRequestId;
    }

    serviceRequestId = Number(serviceRequest.getId());
    serviceRequestEntity.changeId(ServiceRequestId.create(serviceRequestId));
    serviceRequestEntity =
      this.publisher.mergeObjectContext(serviceRequestEntity);
    serviceRequestEntity.create();
    serviceRequestEntity.commit();
    return serviceRequestId;
  }
}
