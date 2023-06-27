import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateProductValidator } from '../validators/create-product.validator';
import { CreateProductDto } from '../dto/request/create-product.dto';
import { CreateProductCommand } from '../commands/create-product.command';
import { CreateProductResponseDto } from '../dto/response/create-product-response.dto';
import { ProductDTO } from '../dto/product.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Product } from 'src/workshop-service-management/domain/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    private commandBus: CommandBus,
    private createProductValidator: CreateProductValidator,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async create(
    createProductDto: CreateProductDto,
  ): Promise<Result<AppNotification, CreateProductDto>> {
    const notification: AppNotification =
      await this.createProductValidator.validate(createProductDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const createProductCommand: CreateProductCommand = new CreateProductCommand(
      createProductDto.productName,
      createProductDto.quantityProduct,
      createProductDto.amount,
      createProductDto.currency,
      createProductDto.inventoryId,
    );
    const productId = await this.commandBus.execute(createProductCommand);
    const createProductResponseDto: CreateProductResponseDto =
      new CreateProductResponseDto(
        productId,
        createProductDto.productName,
        createProductDto.quantityProduct,
        createProductDto.amount,
        createProductDto.currency,
        createProductDto.inventoryId,
      );
    return Result.ok(createProductResponseDto);
  }

  async findAll(): Promise<Result<AppNotification, ProductDTO[]>> {
    const products = await this.productRepository.find({
      relations: ['inventory'],
    });

    const productDtos: ProductDTO[] = products.map((product) => {
      const productDto = new ProductDTO();
      productDto.id = Number(product.getId());
      productDto.productName = product.getName();
      productDto.quantityProduct = product.getQuantityProduct();
      productDto.amount = product.getPrice().getAmount();
      productDto.currency = product.getPrice().getCurrency();
      productDto.inventoryId = Number(product.getInventory().getId());
      return productDto;
    });
    return Result.ok(productDtos);
  }

  async findById(
    productId: Number,
  ): Promise<Result<AppNotification, ProductDTO>> {
    const product = await this.productRepository.findOne({
      relations: ['inventory'],
      where: {
        id: productId,
      } as FindOptionsWhere<Product>,
    });

    const productDto = new ProductDTO();
    productDto.id = Number(product.getId());
    productDto.productName = product.getName();
    productDto.quantityProduct = product.getQuantityProduct();
    productDto.amount = product.getPrice().getAmount();
    productDto.currency = product.getPrice().getCurrency();
    productDto.inventoryId = Number(product.getInventory().getId());
    return Result.ok(productDto);
  }
}