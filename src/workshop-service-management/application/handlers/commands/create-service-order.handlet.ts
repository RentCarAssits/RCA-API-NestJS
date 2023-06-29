import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from 'src/workshop-service-management/domain/value-objects/price.value';
import { Period } from '../../../domain/value-objects/period.value';
import { CreateServiceOrderCommand } from '../../commands/create-service-order.command';
import { ServiceOrder } from 'src/workshop-service-management/domain/entities/service-order.entity';
import { ServiceOrderFactory } from 'src/workshop-service-management/domain/factories/service-order.factory';
import { ServiceOrderId } from '../../../domain/value-objects/service-order-id.value';

@CommandHandler(CreateServiceOrderCommand)
export class CreateServiceOrderHandler
  implements ICommandHandler<CreateServiceOrderCommand>
{
  constructor(
    @InjectRepository(ServiceOrder)
    private serviceOrderRepository: Repository<ServiceOrder>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateServiceOrderCommand) {
    let serviceOrderId: number = 0;
    const humanResources = command.humanResources;
    const price = Price.create(command.amount, command.currency);
    const period = Period.create(command.start, command.end);
    let serviceOrder: ServiceOrder = ServiceOrderFactory.createFrom(
      humanResources,
      price,
      period,
    );
    const aux = serviceOrder;
    const serviceOrderAux = this.serviceOrderRepository.create(aux);
    let serviceOrderTypeORM = await this.serviceOrderRepository.save(
      serviceOrderAux,
    );
    if (serviceOrderTypeORM == null) {
      return serviceOrderId;
    }
    serviceOrderId = Number(serviceOrderTypeORM.getId());
    serviceOrderTypeORM.changeId(ServiceOrderId.of(serviceOrderId));
    serviceOrderTypeORM =
      this.publisher.mergeObjectContext(serviceOrderTypeORM);
    serviceOrderTypeORM.create();
    serviceOrderTypeORM.commit();
    return serviceOrderId;
  }
}
