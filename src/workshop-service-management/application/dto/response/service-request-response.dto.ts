export class ServiceRequestResponseDto {
  constructor(
    public readonly id: number,
    public readonly descriptionProblems: string,
    public readonly workshopId: number,
    public readonly ownerId: number,
    public readonly vehicleId: number,
  ) {}
}
