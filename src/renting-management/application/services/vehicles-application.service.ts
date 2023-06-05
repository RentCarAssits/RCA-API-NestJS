import { RegisterVehicleValidator } from '../validators/register-vehicle.validator';
import { Injectable } from '@nestjs/common';
import { AppNotification } from 'src/shared/application/app.notification';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { RegisterVehicle } from '../commands/register-vehicle.command';
import { RegisterVehicleRequest } from '../requests/register-vehicle.request';
import { RegisterVehicleResponse } from '../responses/register-vehicle.response';
import { Connection } from 'typeorm';
import { User } from '../../../iam-management/domain/entities/user.entity';

@Injectable()
export class VehiclesApplicationService {
  constructor(
    private connection: Connection,
    private commandBus: CommandBus,
    private registerVehicleValidator: RegisterVehicleValidator,
  ) {
    console.log('this.connection.isConnected: ', this.connection.isConnected);
  }

  async register(
    owner: User,
    registerVehicleRequest: RegisterVehicleRequest,
  ): Promise<Result<AppNotification, RegisterVehicleResponse>> {
    const notification: AppNotification =
      await this.registerVehicleValidator.validate(
        registerVehicleRequest,
        owner,
      );
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const registerVehicle: RegisterVehicle = new RegisterVehicle(
      registerVehicleRequest.name,
      registerVehicleRequest.brand,
      registerVehicleRequest.model,
      registerVehicleRequest.integrity,
      registerVehicleRequest.state,
      registerVehicleRequest.year,
      owner.id,
      registerVehicleRequest.categories,
    );
    const vehicleId: number = await this.commandBus.execute(registerVehicle);
    const registerVehicleResponse: RegisterVehicleResponse =
      new RegisterVehicleResponse(
        vehicleId,
        registerVehicle.name,
        registerVehicle.brand,
        registerVehicle.model,
        registerVehicle.integrity,
        Number(registerVehicle.state),
        registerVehicle.year,
        registerVehicle.ownerId,
        registerVehicleRequest.categories,
      );
    return Result.ok(registerVehicleResponse);
  }
}
