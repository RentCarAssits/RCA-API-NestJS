import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterVehicleRequest } from '../requests/register-vehicle.request';

import { AppNotification } from 'src/shared/application/app.notification';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';

@Injectable()
export class RegisterVehicleValidator {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
  ) {}

  public async validate(
    registerVehicleRequest: RegisterVehicleRequest,
  ): Promise<AppNotification> {
    const notification: AppNotification = new AppNotification();
    const name: string = registerVehicleRequest.name.trim();
    if (name.length <= 0) {
      notification.addError('Vehicle name is required', null);
    }
    if (notification.hasErrors()) {
      return notification;
    }
    return notification;
  }
}
