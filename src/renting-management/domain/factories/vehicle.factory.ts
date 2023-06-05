import { Vehicle } from '../entities/vehicle.entity';
import { VehicleState } from '../enums/vehicle-state.enum';
import { Brand } from '../values/brand.value';
import { Model } from '../values/model.value';
import { VehicleId } from '../values/vehicle-id.value';
import { VehicleIntegrity } from '../values/vehicle-integrity.value';
import { VehicleName } from '../values/vehicle-name.value';

export class VehicleFactory {
  public static createFrom(
    name: VehicleName,
    brand: Brand,
    model: Model,
    integrity: VehicleIntegrity,
    year: Date,
    state: VehicleState,
  ): Vehicle {
    return new Vehicle(name, brand, model, integrity, year, state);
  }

  public static withId(
    vehicleId: VehicleId,
    name: VehicleName,
    brand: Brand,
    model: Model,
    integrity: VehicleIntegrity,
    year: Date,
    state: VehicleState,
  ): Vehicle {
    const vehicle: Vehicle = new Vehicle(
      name,
      brand,
      model,
      integrity,
      year,
      state,
    );
    vehicle.changeId(vehicleId);
    return vehicle;
  }
}
