import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateRequestItemValidator } from '../validators/create-request-item.validator';
import { CreateRequestItemDto } from '../dto/request/create-request-item.dto';
import { CreateRequestItemCommand } from '../commands/create-request-item.command';
import { CreateRequestItemResponseDto } from '../dto/response/create-request-item-response.dto';
import { RequestItemDto } from '../dto/request-item.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RequestItem } from '../../domain/entities/request-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceItem } from 'src/workshop-service-management/domain/entities/service-item.entity';
import { ServiceItemId } from '../../domain/value-objects/service-item-id.value';

@Injectable()
export class RequestItemService {
  constructor(
    private commandBus: CommandBus,
    private createRequestItemValidator: CreateRequestItemValidator,

    @InjectRepository(RequestItem)
    private requestItemRepository: Repository<RequestItem>,

    @InjectRepository(ServiceItem)
    private serviceItemRepository: Repository<ServiceItem>,
  ) {}
  async create(
    createRequestItemDto: CreateRequestItemDto,
  ): Promise<Result<AppNotification, CreateRequestItemDto>> {
    const notification: AppNotification =
      await this.createRequestItemValidator.validate(createRequestItemDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const createRequestItemCommand: CreateRequestItemCommand =
      new CreateRequestItemCommand(
        createRequestItemDto.quantityRequestItem,
        createRequestItemDto.amount,
        createRequestItemDto.currency,
        createRequestItemDto.productId,
        createRequestItemDto.serviceItemId,
      );
    const requestItemId = await this.commandBus.execute(
      createRequestItemCommand,
    );
    const createRequestItemResponseDto: CreateRequestItemResponseDto =
      new CreateRequestItemResponseDto(
        requestItemId,
        createRequestItemDto.quantityRequestItem,
        createRequestItemDto.amount,
        createRequestItemDto.currency,
        createRequestItemDto.productId,
        createRequestItemDto.serviceItemId,
      );
    return Result.ok(createRequestItemResponseDto);
  }
  async findAll(): Promise<Result<AppNotification, RequestItemDto[]>> {
    const requestItems = await this.requestItemRepository.find();

    const requestItemDtos: RequestItemDto[] = requestItems.map(
      (requestItem) => {
        const requestItemDto = new RequestItemDto();
        requestItemDto.id = Number(requestItem.getId());
        requestItemDto.quantityRequestItem =
          requestItem.getQuantityRequestItem();
        requestItemDto.amount = requestItem.getPrice().getAmount();
        requestItemDto.currency = requestItem.getPrice().getCurrency();
        requestItemDto.productId = Number(requestItem.getProduct().getId());
        requestItemDto.serviceItemId = Number(
          requestItem.getServiceItem().getId(),
        );
        return requestItemDto;
      },
    );
    return Result.ok(requestItemDtos);
  }
  async findAllByServiceITemId(
    serviceItemId: number,
  ): Promise<Result<AppNotification, RequestItemDto[]>> {
    const serviceItem = await this.serviceItemRepository.findOne({
      where: {
        id: serviceItemId,
      } as FindOptionsWhere<ServiceItem>,
    });
    const requestItems = await this.requestItemRepository.find({
      relations: ['product', 'serviceItem'],
      where: {
        serviceItem: serviceItem,
      } as FindOptionsWhere<RequestItem>,
    });
    const requestItemDtos: RequestItemDto[] = requestItems.map(
      (requestItem) => {
        const requestItemDto = new RequestItemDto();
        requestItemDto.id = Number(requestItem.getId());
        requestItemDto.quantityRequestItem =
          requestItem.getQuantityRequestItem();
        requestItemDto.amount = requestItem.getPrice().getAmount();
        requestItemDto.currency = requestItem.getPrice().getCurrency();
        requestItemDto.productId = Number(requestItem.getProduct().getId());
        requestItemDto.serviceItemId = Number(
          requestItem.getServiceItem().getId(),
        );
        return requestItemDto;
      },
    );
    return Result.ok(requestItemDtos);
  }
  async findbyId(
    requestItemId: number,
  ): Promise<Result<AppNotification, RequestItemDto>> {
    const requestItem = await this.requestItemRepository.findOne({
      relations: ['product', 'serviceItem'],
      where: {
        id: requestItemId,
      } as FindOptionsWhere<RequestItem>,
    });
    const requestItemDto = new RequestItemDto();
    requestItemDto.id = Number(requestItem.getId());
    requestItemDto.quantityRequestItem = requestItem.getQuantityRequestItem();
    requestItemDto.amount = requestItem.getPrice().getAmount();
    requestItemDto.currency = requestItem.getPrice().getCurrency();
    requestItemDto.productId = Number(requestItem.getProduct().getId());
    requestItemDto.serviceItemId = Number(requestItem.getServiceItem().getId());
    return Result.ok(requestItemDto);
  }
}
