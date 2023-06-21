import { RegisterVehicleValidator } from '../validators/register-vehicle.validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppNotification } from 'src/shared/application/app.notification';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { RegisterVehicle } from '../commands/register-vehicle.command';
import { RegisterVehicleRequest } from '../requests/register-vehicle.request';
import { RegisterVehicleResponse } from '../responses/register-vehicle.response';
import { Connection, FindOptions, FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../../../iam-management/domain/entities/user.entity';
import { UpdateVehicleResponse } from '../responses/update-vehicle.response';
import { UpdateVehicle } from '../commands/update-vehicle.command';
import { UpdateVehicleRequest } from '../requests/update-vehicle.request';
import { UpdateVehicleValidator } from '../validators/update-vehicle.validator';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';

@Injectable()
export class VehiclesApplicationService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    private connection: Connection,
    private commandBus: CommandBus,
    private registerVehicleValidator: RegisterVehicleValidator,
    private updateVehicleValidator: UpdateVehicleValidator,
   
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
      registerVehicleRequest.image,
      registerVehicleRequest.stars,
      registerVehicleRequest.price,
      registerVehicleRequest.currency,
      registerVehicleRequest.timeUnit,
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
        registerVehicle.image,
        registerVehicle.stars,
        registerVehicleRequest.categories,
      );
    return Result.ok(registerVehicleResponse);
  }

  async update(
    id: number,
    owner: User,
    updateVehicleRequest: UpdateVehicleRequest,
  ): Promise<Result<AppNotification, UpdateVehicleResponse>> {
    const notification: AppNotification =
      await this.updateVehicleValidator.validate(updateVehicleRequest, owner);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const updateVehicle: UpdateVehicle = new UpdateVehicle(
      id,
      updateVehicleRequest.name,
      updateVehicleRequest.brand,
      updateVehicleRequest.model,
      updateVehicleRequest.integrity,
      updateVehicleRequest.state,
      updateVehicleRequest.year,
      owner.id,
      updateVehicleRequest.image,
      updateVehicleRequest.stars,
      updateVehicleRequest.price,
      updateVehicleRequest.currency,
      updateVehicleRequest.timeUnit,
      updateVehicleRequest.categories,
    );
    const vehicleId: number = await this.commandBus.execute(updateVehicle);
    const updateVehicleResponse: UpdateVehicleResponse =
      new UpdateVehicleResponse(
        vehicleId,
        updateVehicle.name,
        updateVehicle.brand,
        updateVehicle.model,
        updateVehicle.integrity,
        Number(updateVehicle.state),
        updateVehicle.year,
        updateVehicle.ownerId,
        updateVehicle.image,
        updateVehicle.stars,
        updateVehicleRequest.categories,
      );
    return Result.ok(updateVehicleResponse);
  }

  async updateVehicleState(vehicleId: number, newState: number) {
    const vehicle = await this.vehicleRepository.findOneBy({
      id: vehicleId,
    } as FindOptionsWhere<Vehicle>);
  }
}
