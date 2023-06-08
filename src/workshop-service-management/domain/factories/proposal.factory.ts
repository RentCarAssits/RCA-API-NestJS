import { Proposal } from '../entities/proposal.entity';
import { Period } from '../value-objects/period.value';
import { Price } from '../value-objects/price.value';
import { ProductId } from '../value-objects/product-id.value';
import { ProposalId } from '../value-objects/proposal-id.value';

export class ProposalFactory {
  public static createFrom(
    humanResources: number,
    price: Price,
    period: Period,
  ) {
    return new Proposal(ProposalId.of(0), humanResources, price, period);
  }
  public static withId(
    id: ProposalId,
    humanResources: number,
    price: Price,
    period: Period,
  ) {
    return new Proposal(id, humanResources, price, period);
  }
}
