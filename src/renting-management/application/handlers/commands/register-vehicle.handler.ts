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
import { User } from '../../../../iam-management/domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

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

  private vehicle = Vehicle;

  async execute(command: RegisterVehicle) {
    const categories = command.categories;
    let vehicleId = 0;

    //console.log('command: ', command);
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
    const state = VehicleFactory.State(vehicleState);
    console.log('vehicleState: ', vehicleState, typeof vehicleState);
    console.log('command.state: ', command.state, typeof command.state);
    console.log('state: ', state, typeof state);
    const year: Date = command.year;
    const image: string = command.image;
    const id: number = command.ownerId;
    const stars: number = Math.floor(Math.random() * 200);
    const user = await this.userRepository.findOne({ where: { id: id } });
    const price: number = command.price;
    const currency: string = command.currency;
    const timeUnit: string = command.timeUnit;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const vehicleEntity: Vehicle = VehicleFactory.createFrom(
      vehicleNameResult.value,
      brandResult.value,
      modelResult.value,
      vehicleIntegrityResult.value,
      year,
      Number(command.state),
      image,
      stars,
      price,
      currency,
      timeUnit,
    );

    console.log('vehicleEntity: ', vehicleEntity);

    let categoryEntities = categories.map((category) => {
      const categoryNameResult = CategoryName.create(category);
      if (!categoryNameResult.isSuccess()) {
        console.log('Error creating category name: ', categoryNameResult.error);
        return null;
      } else {
        return new Category(categoryNameResult.value);
      }
    });
    categoryEntities = categoryEntities.filter((category) => category !== null);

    const aux = {
      ...vehicleEntity,
      categories: categoryEntities,
      owner: user,
    };

    const vehicleAux = this.vehicleRepository.create(aux);
    let vehicle = await this.vehicleRepository.save(vehicleAux);
    if (vehicle == null) {
      return vehicleId;
    }
    // console.log('vehicle: ', vehicle);

    vehicleId = Number(vehicle.getId());
    // console.log('vehicleId:', vehicleId);
    vehicle.changeId(VehicleId.of(vehicleId));
    vehicle = this.publisher.mergeObjectContext(vehicle);
    vehicle.register();
    vehicle.commit();
    return vehicleId;
  }
}
