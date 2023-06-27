export class CreateDiagnosticEvent {
  constructor(
    public readonly id: number,
    public readonly diagnosticDescription: string,
  ) {}
}
