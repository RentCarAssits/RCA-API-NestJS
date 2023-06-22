import { User } from 'src/iam-management/domain/entities/user.entity';

export class GetRentOrdersByRenterQuery {
  public constructor(public readonly renter: User) {}
}
