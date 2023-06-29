export class CreateServiceRequestDto {
  constructor(
    public readonly descriptionProblems: string,
    public readonly workshopId: number,
    public readonly ownerId: number,
    public readonly vehicleId: number,
    public readonly vehicleName: string,
    public readonly year: string,
    public readonly vehicleIntegrity: string,
  ) {}
}
