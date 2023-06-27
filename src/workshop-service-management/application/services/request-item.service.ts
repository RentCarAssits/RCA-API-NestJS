import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateRequestItemValidator } from '../validators/create-request-item.validator';
import { CreateRequestItemDto } from '../dto/request/create-request-item.dto';
import { CreateRequestItemCommand } from '../commands/create-request-item.command';
import { CreateRequestItemResponseDto } from '../dto/response/create-request-item-response.dto';

@Injectable()
export class RequestItemService {
  constructor(
    private commandBus: CommandBus,
    private createRequestItemValidator: CreateRequestItemValidator,
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
}
