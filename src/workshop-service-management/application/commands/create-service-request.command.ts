export class CreateServiceRequest {
  constructor(
    public readonly descriptionProblems: string,
    public readonly workshopId: number,
    public readonly ownerId: number,
    public readonly vehicleId: number,
  ) {}
}