import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppNotification } from 'src/shared/application/app.notification';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { Diagnostic } from 'src/workshop-service-management/domain/entities/diagnostic.entity';
import { CreateDiagnosticDTO } from '../dto/request/create-diagnostic.dto';

@Injectable()
export class CreateDiagnosticValidator {
  constructor(
    @InjectRepository(Diagnostic)
    private diagnosticRepository: Repository<Diagnostic>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Vehicle)
    private vechicleRepository: Repository<Vehicle>,
  ) {}

  public async validate(
    diagnostictDto: CreateDiagnosticDTO,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const descriptionProblems: string = diagnostictDto.diagnosticDescription;
    if (descriptionProblems === null) {
      notification.addError('Description Problem is required', null);
    }

    const vehicleId: number = diagnostictDto.vehicleId;
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

    const ownerId: number = diagnostictDto.ownerId;
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

    const mechanicId: number = diagnostictDto.mechanicId;
    if (mechanicId == null) {
      notification.addError('Mechanic Id is required', null);
    } else if (mechanicId <= 0) {
      notification.addError('Mechanic Id is invalid ', null);
    } else {
      const mechanic: User = await this.userRepository
        .createQueryBuilder()
        .where('id = :mechanicId', { mechanicId })
        .getOne();
      if (mechanic == null) {
        notification.addError(
          'Mechanic with the specified Id does not exist',
          null,
        );
      }
    }

    return notification;
  }
}
