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
import { Category } from '../../../domain/entities/category.entity';
import { CategoryName } from '../../../domain/values/category-name.value';
import { User } from '../../../../iam-management/domain/entities/user.entity';

@CommandHandler(RegisterVehicle)
export class RegisterVehicleHandler
  implements ICommandHandler<RegisterVehicle>
{
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: RegisterVehicle) {
    let vehicleId = 0;

    const nameResult: Result<AppNotification, VehicleName> = VehicleName.create(
      command.name,
    );
    if (nameResult.isFailure()) return vehicleId;

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
    const state = VehicleFactory.State(Number(command.state));

    const year: Date = command.year;
    const image: string = command.image;
    const id: number = command.ownerId;
    const stars: number = 0;
    const user = await this.userRepository.findOne({ where: { id: id } });

    let categoryEntities = command.categories.map((category) => {
      const categoryNameResult = CategoryName.create(category);
      if (!categoryNameResult.isSuccess()) return null;
      else return new Category(categoryNameResult.value);
    });

    categoryEntities = categoryEntities.filter((category) => category !== null);
    const vehicleEntity: Vehicle = VehicleFactory.createFrom(
      nameResult.value,
      brandResult.value,
      modelResult.value,
      vehicleIntegrityResult.value,
      year,
      state,
      image,
      stars,
      command.price,
      command.currency,
      command.timeUnit,
    );

    const vehicleWithCategoriesModel = {
      ...vehicleEntity,
      categories: categoryEntities,
      owner: user,
    };

    const vehicleAux = this.vehicleRepository.create(
      vehicleWithCategoriesModel,
    );
    let vehicle = await this.vehicleRepository.save(vehicleAux);
    if (vehicle == null) return vehicleId;

    vehicleId = Number(vehicle.getId());
    vehicle.changeId(VehicleId.of(vehicleId));
    vehicle = this.publisher.mergeObjectContext(vehicle);
    vehicle.register();
    vehicle.commit();
    return vehicleId;
  }
}
