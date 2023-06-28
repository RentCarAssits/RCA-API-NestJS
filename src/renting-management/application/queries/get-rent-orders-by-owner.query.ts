import { User } from 'src/iam-management/domain/entities/user.entity';

export class GetRentOrdersByOwnerQuery {
  public constructor(public readonly owner: User) {}
}
