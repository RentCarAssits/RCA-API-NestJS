import { ServiceRequest } from '../entities/service-request.entity';

export class ServiceRequestFactory {
  public static createFrom(descriptionProblems: string): ServiceRequest {
    return new ServiceRequest(descriptionProblems);
  }
}
