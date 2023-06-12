import { ServiceRequest } from '../entities/service-request.entity';
import { OwnerIdFK } from '../value-objects/owner-id-fk.value';
import { VehicleIdFK } from '../value-objects/vehicle-id-fk.value';
import { WorkshopIdFK } from '../value-objects/workshop-id-fk.value';

export class ServiceRequestFactory {
  public static createFrom(
    descriptionProblems: string,
    workshopId: WorkshopIdFK,
    vehicleId: VehicleIdFK,
    ownerId: OwnerIdFK,
  ): ServiceRequest {
    return new ServiceRequest(
      descriptionProblems,
      workshopId,
      vehicleId,
      ownerId,
    );
  }
}
