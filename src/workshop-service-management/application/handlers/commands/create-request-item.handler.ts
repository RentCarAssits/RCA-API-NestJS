import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from 'src/workshop-service-management/domain/value-objects/price.value';
import { CreateRequestItemCommand } from '../../commands/create-request-item.command';
import { RequestItemFactory } from 'src/workshop-service-management/domain/factories/request-item.factory';
import { RequestItem } from '../../../domain/entities/request-item.entity';
import { Product } from '../../../domain/entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { ServiceItem } from 'src/workshop-service-management/domain/entities/service-item.entity';
import { RequestItemId } from 'src/workshop-service-management/domain/value-objects/request-item-id.value';

@CommandHandler(CreateRequestItemCommand)
export class CreateRequestItemHandler
  implements ICommandHandler<CreateRequestItemCommand>
{
  constructor(
    @InjectRepository(RequestItem)
    private requestItemRepository: Repository<RequestItem>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(ServiceItem)
    private serviceItemRepository: Repository<ServiceItem>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateRequestItemCommand) {
    let requestItemId: number = 0;
    const price = Price.create(command.amount, command.currency);
    const quantityRequestItem = command.quantityRequestItem;
    let requestItem: RequestItem = RequestItemFactory.createFrom(
      quantityRequestItem,
      price,
    );

    const productId: number = command.productId;
    const product = await this.productRepository
      .createQueryBuilder()
      .where('product.id = :id', { id: productId })
      .getOne();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const serviceItemId: number = command.serviceItemId;
    const serviceItem = await this.serviceItemRepository
      .createQueryBuilder()
      .where('serviceItem.id = :id', { id: serviceItemId })
      .getOne();
    if (!serviceItem) {
      throw new NotFoundException('Service Item not found');
    }
    const aux = {
      ...requestItem,
      product: product,
      serviceItem: serviceItem,
    };
    const requestItemAux = this.requestItemRepository.create(aux);
    let requestItemTypeORM = await this.requestItemRepository.save(
      requestItemAux,
    );
    if (requestItemTypeORM == null) {
      requestItemId;
    }
    requestItemId = Number(requestItemTypeORM.getId());
    requestItemTypeORM.changeId(RequestItemId.of(requestItemId));
    requestItemTypeORM = this.publisher.mergeObjectContext(requestItemTypeORM);
    requestItemTypeORM.create();
    requestItemTypeORM.commit();
    return requestItemId;
  }
}
