import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateVehicle } from '../../commands/update-vehicle.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Category } from '../../../domain/entities/category.entity';
import { VehicleId } from '../../../domain/values/vehicle-id.value';
import { VehicleFactory } from '../../../domain/factories/vehicle.factory';
import { VehicleName } from '../../../domain/values/vehicle-name.value';
import { Result } from 'typescript-result';
import { AppNotification } from '../../../../shared/application/app.notification';
import { Brand } from '../../../domain/values/brand.value';
import { Model } from '../../../domain/values/model.value';
import { VehicleIntegrity } from '../../../domain/values/vehicle-integrity.value';
import { VehicleState } from '../../../domain/enums/vehicle-state.enum';

@CommandHandler(UpdateVehicle)
export class UpdateVehicleHandler implements ICommandHandler<UpdateVehicle> {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: UpdateVehicle) {
    let vehicleId = 0;

    console.log('command: ', command);
    const idAux = VehicleId.of(command.id);

    console.log('IDDD: ', idAux);

    const vehicle = await this.vehicleRepository.findOneBy({
      id: command.id,
    } as FindOptionsWhere<Vehicle>);

    const vehicleNameResult: Result<AppNotification, VehicleName> =
      VehicleName.create(command.name);
    if (vehicleNameResult.isFailure()) return vehicleId;

    const brandResult: Result<AppNotification, Brand> = Brand.create(
      command.brand,
    );
    if (brandResult.isFailure()) return vehicleId;

    const modelResult: Result<AppNotification, Model> = Model.create(
      command.model,
    );
    if (modelResult.isFailure()) return vehicleId;

    const vehicleIntegrityResult: Result<AppNotification, VehicleIntegrity> =
      VehicleIntegrity.create(command.integrity);
    if (vehicleIntegrityResult.isFailure()) return vehicleId;

    const vehicleState: VehicleState = Number(command.state);
    const year: Date = command.year;
    const image: string = command.image;

    const vId = VehicleFactory.withId(
      vehicle.getId(),
      vehicleNameResult.value,
      brandResult.value,
      modelResult.value,
      vehicleIntegrityResult.value,
      year,
      vehicleState,
      image,
    );
    const vehicleAux = this.vehicleRepository.create(vId);
    let updatedVehicle = await this.vehicleRepository.save(vehicleAux);
    if (!updatedVehicle) {
      return vehicleId;
    }

    vehicleId = Number(updatedVehicle.getId());
    console.log('vehicleId:', vehicleId);
    updatedVehicle.changeId(VehicleId.of(vehicleId));
    updatedVehicle = this.publisher.mergeObjectContext(updatedVehicle);
    updatedVehicle.updated();
    updatedVehicle.commit();
    return vehicleId;
  }
}
