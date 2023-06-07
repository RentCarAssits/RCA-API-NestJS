export class UpdateVehicle {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly integrity: string,
    public readonly state: number,
    public readonly year: Date,
    public readonly ownerId: number,
    public readonly image: string,
    public readonly categories: string[],
  ) {}
}
