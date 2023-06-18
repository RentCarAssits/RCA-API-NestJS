import { Diagnostic } from '../entities/diagnostic.entity';
import { ServiceRequest } from '../entities/service-request.entity';
import { VehicleIdFK } from '../value-objects/vehicle-id-fk.value';

export class DiagnosticFactory {
  public static createFrom(diagnosticDescription: string): Diagnostic {
    return new Diagnostic(diagnosticDescription);
  }
}
