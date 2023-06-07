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
    image: string,
    stars: number,
  ): Vehicle {
    const stateAux = this.State(state);
    return new Vehicle(
      name,
      brand,
      model,
      integrity,
      year,
      stateAux,
      image,
      stars,
    );
  }

  public static withId(
    vehicleId: VehicleId,
    name: VehicleName,
    brand: Brand,
    model: Model,
    integrity: VehicleIntegrity,
    year: Date,
    state: number,
    image: string,
    stars,
  ): Vehicle {
    const vehicle: Vehicle = new Vehicle(
      name,
      brand,
      model,
      integrity,
      year,
      state,
      image,
      stars,
    );
    vehicle.changeId(vehicleId);
    return vehicle;
  }

  public static State(type: number) {
    switch (type) {
      case 0:
        return VehicleState.MAINTENANCE;
      case 1:
        return VehicleState.AVAILABLE;
      case 2:
        return VehicleState.RENTED;
      case 3:
        return VehicleState.UNAVAILABLE;
      default:
        throw new Error(`Invalid number: ${type}`);
    }
  }
}
