import { Body, Controller, Post, Res, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { ApiController } from 'src/shared/api/api.controller';
import { ProductService } from '../application/services/product.service';
import { ProductDTO } from '../application/dto/product.dto';
import { CreateProductDto } from '../application/dto/request/create-product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Product' })
  @ApiBody({ type: [CreateProductDto] })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res({ passthrough: true }) response,
  ): Promise<object> {
    try {
      const result: Result<AppNotification, CreateProductDto> =
        await this.productService.create(createProductDto);
      if (result.isSuccess()) {
        return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get()
  async getAll(@Res({ passthrough: true }) response: any) {
    try {
      const result: Result<AppNotification, ProductDTO[]> =
        await this.productService.findAll();
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get('/:id')
  async getById(
    @Param('id') productId: number,
    @Res({ passthrough: true }) response: any,
  ) {
    try {
      const result: Result<AppNotification, ProductDTO> =
        await this.productService.findById(productId);
      if (result.isSuccess()) {
        return ApiController.ok(response, result.value);
      }
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}
