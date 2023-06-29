import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from 'src/workshop-service-management/domain/value-objects/price.value';
import { NotFoundException } from '@nestjs/common';
import { CreateServiceItemCommand } from '../../commands/create-service-item.command';
import { ServiceItemFactory } from 'src/workshop-service-management/domain/factories/service-item.factory';
import { ServiceItem } from '../../../domain/entities/service-item.entity';
import { Proposal } from '../../../domain/entities/proposal.entity';
import { ServiceItemId } from 'src/workshop-service-management/domain/value-objects/service-item-id.value';
import { CreateServiceItemOrderCommand } from '../../commands/create-service-item-order.command';
import { ServiceItemOrder } from 'src/workshop-service-management/domain/entities/service-item-order-entity';
import { ServiceOrder } from 'src/workshop-service-management/domain/entities/service-order.entity';
import { ServiceItemOrderFactory } from 'src/workshop-service-management/domain/factories/service-item-order.factory';
import { ServiceItemOrderId } from '../../../domain/value-objects/service-item-order-id.value';

@CommandHandler(CreateServiceItemOrderCommand)
export class CreateServiceItemOrderHandler
  implements ICommandHandler<CreateServiceItemOrderCommand>
{
  constructor(
    @InjectRepository(ServiceOrder)
    private serviceOrderRepository: Repository<ServiceOrder>,

    @InjectRepository(ServiceItemOrder)
    private serviceItemOrderRepository: Repository<ServiceItemOrder>,

    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateServiceItemOrderCommand) {
    let serviceItemId: number = 0;
    const price = Price.create(command.amount, command.currency);
    const serviceName = command.serviceType;
    const resources = command.resources;
    let serviceItemOrder: ServiceItemOrder = ServiceItemOrderFactory.createFrom(
      serviceName,
      price,
      resources,
    );

    const serviceOrderId: number = command.serviceOrderId;
    const serviceOrder = await this.serviceOrderRepository
      .createQueryBuilder()
      .where('serviceOrder.id = :id', { id: serviceOrderId })
      .getOne();
    if (!serviceOrder) {
      throw new NotFoundException('service Order not found');
    }

    const aux = {
      ...serviceItemOrder,
      serviceOrder: serviceOrder,
    };
    const serviceItemOrderAux = this.serviceItemOrderRepository.create(aux);
    let serviceItemOrderTypeORM = await this.serviceItemOrderRepository.save(
      serviceItemOrderAux,
    );
    if (serviceItemOrderTypeORM == null) {
      serviceItemId;
    }
    serviceItemId = Number(serviceItemOrderTypeORM.getId());
    serviceItemOrderTypeORM.changeId(ServiceItemOrderId.of(serviceItemId));
    serviceItemOrderTypeORM = this.publisher.mergeObjectContext(
      serviceItemOrderTypeORM,
    );
    serviceItemOrderTypeORM.create();
    serviceItemOrderTypeORM.commit();
    return serviceItemId;
  }
}
