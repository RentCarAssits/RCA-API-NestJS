import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Price } from '../value-objects/price.value';
import { ServiceItemId } from '../value-objects/service-item-id.value';
import { RequestItem } from './request-item.entity';
import { Proposal } from './proposal.entity';
import { CreateServiceItemEvent } from '../events/create-service-item.event';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity('service_item')
export class ServiceItem extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: ServiceItemId;

  @Column('varchar', { name: 'service_name' })
  private serviceName: string;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @Column('bigint', { name: 'resources' })
  private resources: number;

  @OneToMany(() => RequestItem, (RequestItem) => RequestItem)
  private requestItems: RequestItem[];

  @ManyToOne(() => Proposal, (proposal) => proposal.getServiceItems)
  @JoinColumn({ name: 'proposal_id' })
  private proposal: Proposal;

  public constructor(serviceName: string, price: Price, resources: number) {
    super();
    this.serviceName = serviceName;
    this.price = price;
    this.resources = resources;
  }
  public create() {
    const event = new CreateServiceItemEvent(
      this.id.getValue(),
      this.serviceName,
      this.price.getAmount(),
      this.price.getCurrency(),
      this.resources,
    );
    this.apply(event);
  }
  public getId(): ServiceItemId {
    return this.id;
  }

  public getServiceName(): string {
    return this.serviceName;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getRequestItems(): RequestItem[] {
    return this.requestItems;
  }

  public getProposal(): Proposal {
    return this.proposal;
  }

  public getResources(): number {
    return this.resources;
  }
  public changeId(id: ServiceItemId) {
    this.id = id;
  }
}
