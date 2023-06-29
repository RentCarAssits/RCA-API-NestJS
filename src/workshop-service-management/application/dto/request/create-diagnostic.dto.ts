export class CreateDiagnosticDTO {
  constructor(
    public readonly diagnosticDescription: string,
    public readonly ownerId: number,
    public readonly vehicleId: number,
    public readonly mechanicId: number,
  ) {}
}
