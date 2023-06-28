import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from 'src/workshop-service-management/domain/value-objects/price.value';
import { CreateRequestItemCommand } from '../../commands/create-request-item.command';
import { RequestItemFactory } from 'src/workshop-service-management/domain/factories/request-item.factory';
import { RequestItem } from '../../../domain/entities/request-item.entity';
import { Product } from '../../../domain/entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { RequestItemId } from 'src/workshop-service-management/domain/value-objects/request-item-id.value';
import { CreateServiceItemCommand } from '../../commands/create-service-item.command';
import { ServiceItemFactory } from 'src/workshop-service-management/domain/factories/service-item.factory';
import { ServiceItem } from '../../../domain/entities/service-item.entity';
import { Proposal } from '../../../domain/entities/proposal.entity';
import { ServiceItemId } from 'src/workshop-service-management/domain/value-objects/service-item-id.value';

@CommandHandler(CreateServiceItemCommand)
export class CreateServiceItemHandler
  implements ICommandHandler<CreateServiceItemCommand>
{
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,

    @InjectRepository(ServiceItem)
    private serviceItemRepository: Repository<ServiceItem>,

    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateServiceItemCommand) {
    let serviceItemId: number = 0;
    const price = Price.create(command.amount, command.currency);
    const serviceType = command.serviceType;
    const resources = command.resources;
    let serviceItem: ServiceItem = ServiceItemFactory.createFrom(
      serviceType,
      price,
      resources,
    );

    const proposalId: number = command.proposalId;
    const proposal = await this.proposalRepository
      .createQueryBuilder()
      .where('proposal.id = :id', { id: proposalId })
      .getOne();
    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    const aux = {
      ...serviceItem,
      proposal: proposal,
    };
    const serviceItemAux = this.serviceItemRepository.create(aux);
    let serviceItemTypeORM = await this.serviceItemRepository.save(
      serviceItemAux,
    );
    if (serviceItemTypeORM == null) {
      serviceItemId;
    }
    serviceItemId = Number(serviceItemTypeORM.getId());
    serviceItemTypeORM.changeId(ServiceItemId.of(serviceItemId));
    serviceItemTypeORM = this.publisher.mergeObjectContext(serviceItemTypeORM);
    serviceItemTypeORM.create();
    serviceItemTypeORM.commit();
    return serviceItemId;
  }
}
