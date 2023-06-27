import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateWarehouseValidator } from '../validators/create-warehouse.validator';
import { CreateWarehouseDTO } from '../dto/request/create-warehouse.dto';
import { CreateWarehouseCommand } from '../commands/create-warehouse.command';
import { CreateWarehouseResponseDTO } from '../dto/response/create-warehouse-response.dto';

@Injectable()
export class WarehouseService {
  constructor(
    private commandBus: CommandBus,
    private createWarehouseValidator: CreateWarehouseValidator,
  ) {}
  async create(
    createWarehouseDto: CreateWarehouseDTO,
  ): Promise<Result<AppNotification, CreateWarehouseDTO>> {
    const notification: AppNotification =
      await this.createWarehouseValidator.validate(createWarehouseDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const createWarehouseCommand: CreateWarehouseCommand =
      new CreateWarehouseCommand(
        createWarehouseDto.name,
        createWarehouseDto.country,
        createWarehouseDto.district,
        createWarehouseDto.addressDetail,
      );
    const warehouselId = await this.commandBus.execute(createWarehouseCommand);
    const createWarehouseResponseDto: CreateWarehouseResponseDTO =
      new CreateWarehouseResponseDTO(
        warehouselId,
        createWarehouseDto.name,
        createWarehouseDto.country,
        createWarehouseDto.district,
        createWarehouseDto.addressDetail,
      );
    return Result.ok(createWarehouseResponseDto);
  }
}
