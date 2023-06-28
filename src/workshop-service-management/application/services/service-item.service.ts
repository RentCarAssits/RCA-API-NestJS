import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateRequestItemValidator } from '../validators/create-request-item.validator';
import { CreateRequestItemDto } from '../dto/request/create-request-item.dto';
import { CreateRequestItemCommand } from '../commands/create-request-item.command';
import { CreateRequestItemResponseDto } from '../dto/response/create-request-item-response.dto';
import { CreateServiceItemDto } from '../dto/request/create-service-item.dto';
import { CreateServicetItemValidator } from '../validators/create-service-item.validator';
import { CreateServiceItemCommand } from '../commands/create-service-item.command';
import { CreateServiceItemResponseDto } from '../dto/response/create-service-item-response.sto';

@Injectable()
export class ServiceItemService {
  constructor(
    private commandBus: CommandBus,
    private createServiceItemValidator: CreateServicetItemValidator,
  ) {}
  async create(
    createServiceItemDto: CreateServiceItemDto,
  ): Promise<Result<AppNotification, CreateServiceItemDto>> {
    const notification: AppNotification =
      await this.createServiceItemValidator.validate(createServiceItemDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const createServiceItemCommand: CreateServiceItemCommand =
      new CreateServiceItemCommand(
        createServiceItemDto.serviceType,
        createServiceItemDto.resources,
        createServiceItemDto.amount,
        createServiceItemDto.currency,
        createServiceItemDto.proposalId,
      );
    const serviceItemId = await this.commandBus.execute(
      createServiceItemCommand,
    );
    const createServiceItemResponseDto: CreateServiceItemResponseDto =
      new CreateServiceItemResponseDto(
        serviceItemId,
        createServiceItemDto.serviceType,
        createServiceItemDto.resources,
        createServiceItemDto.amount,
        createServiceItemDto.currency,
        createServiceItemDto.proposalId,
      );
    return Result.ok(createServiceItemResponseDto);
  }
}
