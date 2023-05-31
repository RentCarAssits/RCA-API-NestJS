import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterVehicle } from '../../commands/register-vehicle.command';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { Repository } from 'typeorm';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { VehicleName } from 'src/renting-management/domain/values/vehicle-name.value';
import { Brand } from 'src/renting-management/domain/values/brand.value';
import { VehicleIntegrity } from 'src/renting-management/domain/values/vehicle-integrity.value';
import { Model } from 'src/renting-management/domain/values/model.value';
import { VehicleFactory } from 'src/renting-management/domain/factories/vehicle.factory';
import { VehicleId } from 'src/renting-management/domain/values/vehicle-id.value';
import { VehicleState } from 'src/renting-management/domain/enums/vehicle-state.enum';
import { Category } from '../../../domain/entities/category.entity';
import { CategoryName } from '../../../domain/values/category-name.value';

@CommandHandler(RegisterVehicle)
export class RegisterVehicleHandler
  implements ICommandHandler<RegisterVehicle>
{
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private publisher: EventPublisher,
  ) {}

  private vehicle = Vehicle;

  async execute(command: RegisterVehicle) {
    const categories = command.categories;
    let vehicleId = 0;

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

    const vehicleEntity: Vehicle = VehicleFactory.createFrom(
      vehicleNameResult.value,
      brandResult.value,
      modelResult.value,
      vehicleIntegrityResult.value,
      year,
      vehicleState,
    );

    let categoryEntities = categories.map((category) => {
      const categoryNameResult = CategoryName.create(category);
      if (!categoryNameResult.isSuccess()) {
        // Handle error case
        console.log('Error creating category name: ', categoryNameResult.error);
        return null;
      } else {
        return new Category(categoryNameResult.value);
      }
    });
    categoryEntities = categoryEntities.filter((category) => category !== null);

    const aux = {
      name: vehicleNameResult.value,
      brand: brandResult.value,
      model: modelResult.value,
      integrity: vehicleIntegrityResult.value,
      year: year,
      vehicleSate: vehicleState,
      categories: categoryEntities,
    };

    const vehicleAux = this.vehicleRepository.create(aux);
    let vehicle = await this.vehicleRepository.save(vehicleAux);
    if (vehicle == null) {
      return vehicleId;
    }
    console.log('vehicle: ', vehicle);

    vehicleId = Number(vehicle.getId());
    console.log('vehicleId:', vehicleId);
    vehicle.changeId(VehicleId.of(vehicleId));
    vehicle = this.publisher.mergeObjectContext(vehicle);
    vehicle.register();
    vehicle.commit();
    return vehicleId;
  }
}
