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

@Entity('service_item')
export class ServiceItem {
  @PrimaryGeneratedColumn()
  private id: ServiceItemId;

  @Column('varchar', { name: 'service_name' })
  private serviceName: string;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @OneToMany(() => RequestItem, (RequestItem) => RequestItem)
  private requestItems: RequestItem[];

  @ManyToOne(() => Proposal, (proposal) => proposal.getServiceItems)
  @JoinColumn({ name: 'proposal_id' })
  private proposal: Proposal;

  public constructor(
    serviceName: string,
    price: Price,
    requestItems: RequestItem[],
  ) {
    this.serviceName = serviceName;
    this.price = price;
    this.requestItems = requestItems;
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
}