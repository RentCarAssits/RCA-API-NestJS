export class RegisterVehicleResponse {
  constructor(
    public id: number,
    public name: string,
    public brand: string,
    public model: string,
    public integrity: string,
    public state: number,
    public year: Date,
    public categories: string[],
  ) {}
}
