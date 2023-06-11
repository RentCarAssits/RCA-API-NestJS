import { Proposal } from '../entities/proposal.entity';
import { Period } from '../value-objects/period.value';
import { Price } from '../value-objects/price.value';
import { ProposalId } from '../value-objects/proposal-id.value';

export class ProposalFactory {
  public static createFrom(
    humanResources: number,
    price: Price,
    period: Period,
  ) {
    return new Proposal(humanResources, price, period);
  }
  public static withId(humanResources: number, price: Price, period: Period) {
    return new Proposal(humanResources, price, period);
  }
}
