export class RegisterVehicle {
  constructor(
    public readonly name: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly integrity: string,
    public readonly state: number,
    public readonly year: Date,
    public readonly categories: string[],
  ) {}
}
