import { ServiceRequest } from '../entities/service-request.entity';
import { VehicleIdFK } from '../value-objects/vehicle-id-fk.value';

export class ServiceRequestFactory {
  public static createFrom(descriptionProblems: string): ServiceRequest {
    return new ServiceRequest(descriptionProblems);
  }
}
