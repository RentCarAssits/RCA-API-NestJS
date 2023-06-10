export class RegisterVehicleRequest {
  constructor(
    public readonly name: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly integrity: string,
    public readonly state: string,
    public readonly year: Date,
    public readonly ownerId: number,
    public readonly image: string,
    public readonly stars: number,
    public readonly price: number,
    public readonly currency: string,
    public readonly timeUnit: string,
    public readonly categories: string[],
  ) {}
}
