import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequest } from 'src/workshop-service-management/domain/entities/service-request.entity';
import { Repository } from 'typeorm';
import { CreateServiceRequestDto } from '../dto/request/service-request.dto';
import { AppNotification } from 'src/shared/application/app.notification';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { Workshop } from 'src/workshop-service-management/domain/entities/workshop.entity';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';

@Injectable()
export class CreateServiceRequestValidator {
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Workshop)
    private workshopRepository: Repository<Workshop>,

    @InjectRepository(Vehicle)
    private vechicleRepository: Repository<Vehicle>,
  ) {}

  public async validate(
    serviceRequestDto: CreateServiceRequestDto,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const descriptionProblems: string = serviceRequestDto.descriptionProblems;
    if (descriptionProblems === null) {
      notification.addError('Description Problem is required', null);
    }
    const vehicleName: string = serviceRequestDto.vehicleName;
    if (vehicleName === null) {
      notification.addError('Vehicle Name is required', null);
    }
    const year: string = serviceRequestDto.year;
    if (year === null) {
      notification.addError('Year is required', null);
    }
    const vehicleIntegrity: string = serviceRequestDto.vehicleIntegrity;
    if (vehicleIntegrity === null) {
      notification.addError('Vehicle Integrity is required', null);
    }

    const workshopId: number = serviceRequestDto.workshopId;
    if (workshopId == null) {
      notification.addError('Workshop Id is required', null);
    } else if (workshopId <= 0) {
      notification.addError('Workshop Id is invalid ', null);
    } else {
      const workshop: Workshop = await this.workshopRepository
        .createQueryBuilder()
        .where('id = :workshopId', { workshopId })
        .getOne();
      if (workshop == null) {
        notification.addError(
          'Workshop with the specified Id does not exist',
          null,
        );
      }
    }

    const vehicleId: number = serviceRequestDto.vehicleId;
    if (vehicleId == null) {
      notification.addError('Vehicle id is required', null);
    } else if (vehicleId <= 0) {
      notification.addError('Vehicle Id is invalid ', null);
    } else {
      const vechicle: Vehicle = await this.vechicleRepository
        .createQueryBuilder()
        .where('id = :vehicleId', { vehicleId })
        .getOne();
      if (vechicle == null) {
        notification.addError(
          'Vehicle with the specified Id does not exist',
          null,
        );
      }
    }

    const ownerId: number = serviceRequestDto.ownerId;
    if (ownerId == null) {
      notification.addError('OwnerId is required', null);
    } else if (ownerId <= 0) {
      notification.addError('OwnerId is invalid ', null);
    } else {
      const owner: User = await this.userRepository
        .createQueryBuilder()
        .where('id = :ownerId', { ownerId })
        .getOne();
      console.log(owner);
      if (owner == null) {
        notification.addError(
          'User with the specified owner Id does not exist',
          null,
        );
      }
    }

    return notification;
  }
}
