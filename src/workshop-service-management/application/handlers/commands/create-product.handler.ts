import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateProposalCommand } from '../../commands/create-proposal.command';
import { Repository } from 'typeorm';
import { Proposal } from 'src/workshop-service-management/domain/entities/proposal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from 'src/workshop-service-management/domain/value-objects/price.value';
import { CreateProductCommand } from '../../commands/create-product.command';
import { Product } from 'src/workshop-service-management/domain/entities/product.entity';
import { ProdcutFactory } from '../../../domain/factories/product.factory';
import { Inventory } from 'src/workshop-service-management/domain/entities/inventory.entity';
import { NotFoundException } from '@nestjs/common';
import { ProductId } from 'src/workshop-service-management/domain/value-objects/product-id.value';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,

    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateProductCommand) {
    let productId: number = 0;
    const productName = command.productName;
    const quantityProduct = command.quantityProduct;
    const price = Price.create(command.quantity, command.currency);
    let product: Product = ProdcutFactory.createFrom(
      productName,
      quantityProduct,
      price,
    );
    const inventoryId: number = command.inventoryId;
    const inventory = await this.inventoryRepository
      .createQueryBuilder()
      .where('inventory.id = :id', { id: inventoryId })
      .getOne();
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }
    const aux = {
      ...product,
      inventory,
    };

    const productAux = this.productRepository.create(aux);
    let productTypeORM = await this.productRepository.save(productAux);
    if (productTypeORM == null) {
      return productId;
    }
    productId = Number(productTypeORM.getId());
    productTypeORM.changeId(ProductId.of(productId));
    productTypeORM = this.publisher.mergeObjectContext(productTypeORM);
    productTypeORM.create();
    productTypeORM.commit();
    return productId;
  }
}
