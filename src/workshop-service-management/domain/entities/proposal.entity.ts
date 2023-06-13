import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProposalId } from '../value-objects/proposal-id.value';
import { Price } from '../value-objects/price.value';
import { ServiceItem } from './service-item.entity';
import { Period } from '../value-objects/period.value';
import { AggregateRoot } from '@nestjs/cqrs';
import { CreateProposalEvent } from '../events/create-proposal.event';

@Entity('proposal')
export class Proposal extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: ProposalId;

  @Column('int', { name: 'human_resources' })
  private humanResources: number;

  @Column(() => Price, { prefix: false })
  private price: Price;

  @Column(() => Period, { prefix: false })
  private period: Period;

  @OneToMany(() => ServiceItem, (ServiceItem) => ServiceItem.getProposal)
  private serviceItems: ServiceItem[];

  public constructor(humanResources: number, price: Price, period: Period) {
    super();
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
    this.apply(event);
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
