import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ProposalId } from '../value-objects/proposal-id.value';
import { Price } from '../value-objects/price.value';
import { ServiceItem } from './service-item';
import { Period } from '../value-objects/period.value';
import { AggregateRoot } from '@nestjs/cqrs';
import { CreateProposalCommand } from 'src/workshop-service-management/application/commands/create-proposal.command';
import { CreateProposalEvent } from '../events/create-proposal.event';

@Entity('Proposal')
export class Proposal extends AggregateRoot {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: ProposalId;

  @Column('number', { name: 'humanResources' })
  private humanResources: number;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @Column((type) => Period, { prefix: false })
  private period: Period;

  @OneToMany(() => ServiceItem, (ServiceItem) => ServiceItem.getProposal())
  private serviceItems: ServiceItem[];

  public constructor(
    id: ProposalId,
    humanResources: number,
    price: Price,
    period: Period,
  ) {
    super();
    this.id = id;
    this.humanResources = humanResources;
    this.price = price;
    this.period = period;
  }

  public create() {
    const event = new CreateProposalEvent(
      this.id.getValue(),
      this.humanResources,
      this.price.getQuantity(),
      this.price.getCurrency(),
      this.period.getStart(),
      this.period.getEnd(),
    );
  }

  public getId(): ProposalId {
    return this.id;
  }

  public getHumanResources(): number {
    return this.humanResources;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getServiceItems(): ServiceItem[] {
    return this.serviceItems;
  }
  public changeId(id: ProposalId) {
    this.id = id;
  }
}
