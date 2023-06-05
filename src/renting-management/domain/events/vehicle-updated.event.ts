import { VehicleState } from '../enums/vehicle-state.enum';

export class VehicleUpdated {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly integrity: string,
    public readonly state: VehicleState,
    public readonly year: Date,
  ) {}
}
