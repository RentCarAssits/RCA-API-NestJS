import { Diagnostic } from '../entities/diagnostic.entity';

export class DiagnosticFactory {
  public static createFrom(diagnosticDescription: string): Diagnostic {
    return new Diagnostic(diagnosticDescription);
  }
}
