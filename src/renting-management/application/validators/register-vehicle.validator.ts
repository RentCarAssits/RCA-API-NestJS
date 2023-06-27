import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterVehicleRequest } from '../requests/register-vehicle.request';

import { AppNotification } from 'src/shared/application/app.notification';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { User } from '../../../iam-management/domain/entities/user.entity';

@Injectable()
export class RegisterVehicleValidator {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async validate(
    registerVehicleRequest: RegisterVehicleRequest,
    owner: User,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    if (typeof registerVehicleRequest.name === 'string') {
      const name: string = registerVehicleRequest.name.trim();
      if (name.length <= 0) {
        notification.addError('Vehicle name is required', null);
      }
    } else {
      notification.addError('Vehicle name must be a string', null);
    }
    const brand: string = registerVehicleRequest.brand?.trim() || '';
    if (!brand) notification.addError('Vehicle brand is required', null);

    const model: string = registerVehicleRequest.model?.trim() || '';
    if (!model) notification.addError('Vehicle model is required', null);

    const integrity: string = registerVehicleRequest.integrity?.trim() || '';
    if (!integrity)
      notification.addError('Vehicle integrity is required', null);

    const year: Date = registerVehicleRequest.year || null;
    if (!year) notification.addError('Vehicle year is required', null);

    const state: number = Number(registerVehicleRequest.state);
    if (state === null) {
      notification.addError('Vehicle state is required', null);
    }
    if (state > 3)
      notification.addError('Vehicle state must be from 0 to 3', null);
    if (state < 0)
      notification.addError('Vehicle state must be from 0 to 3', null);

    const yearRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!yearRegex.test(year.toString())) {
      notification.addError(
        'Invalid year format. Please provide a year in the format "YYYY-MM-DD"',
        null,
      );
    }

    const categories: string[] = registerVehicleRequest.categories || [];
    if (!Array.isArray(categories)) {
      notification.addError('Vehicle categories must be an array', null);
    }

    const ownerId: number = owner.id || 0;

    if (ownerId <= 0) {
      notification.addError('Invalid owner Id', null);
    }

    const existingUser: User = await this.userRepository
      .createQueryBuilder()
      .where('id = :ownerId', { ownerId })
      .getOne();

    if (!existingUser) {
      notification.addError(
        'User with the specified owner Id does not exist',
        null,
      );
    }

    if (notification.hasErrors()) {
      console.log('NOTIFICATION: ', notification);
      return notification;
    }
    return notification;
  }
}
