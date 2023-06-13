import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequest } from 'src/workshop-service-management/domain/entities/service-request.entity';
import { Repository } from 'typeorm';
import { ServiceRequestDto } from '../dto/request/service-request.dto';
import { AppNotification } from 'src/shared/application/app.notification';

@Injectable()
export class CreateServiceRequestValidator {
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
  ) {}

  public async validate(
    serviceRequestDto: ServiceRequestDto,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const descriptionProblems: string = serviceRequestDto.descriptionProblems;
    if (descriptionProblems === null) {
      notification.addError('Description Problem is required', null);
    }

    const workshopId: number = serviceRequestDto.workshopId;
    if (workshopId == null) {
      notification.addError('Workshop Id is required', null);
    }

    const vehicleId: number = serviceRequestDto.vehicleId;
    if (vehicleId == null) {
      notification.addError('Vehicle id is required', null);
    }

    const ownerId: number = serviceRequestDto.ownerId;
    if (ownerId == null) {
      notification.addError('Owner id is required', null);
    }

    return notification;
  }
}
