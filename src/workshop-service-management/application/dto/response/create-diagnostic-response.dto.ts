export class CreateDiagnosticResponseDTO {
  constructor(
    public readonly id: number,
    public readonly diagnosticDescription: string,
    public readonly ownerId: number,
    public readonly vehicleId: number,
    public readonly mechanicId: number,
  ) {}
}
