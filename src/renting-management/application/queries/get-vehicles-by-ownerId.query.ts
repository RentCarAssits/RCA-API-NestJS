import { User } from '../../../iam-management/domain/entities/user.entity';

export class GetVehiclesByOwnerIdQuery {
  public constructor(public readonly owner: User) {}
}
