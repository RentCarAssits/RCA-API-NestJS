import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateWarehouseValidator } from '../validators/create-warehouse.validator';
import { CreateWarehouseDTO } from '../dto/request/create-warehouse.dto';
import { CreateWarehouseCommand } from '../commands/create-warehouse.command';
import { CreateWarehouseResponseDTO } from '../dto/response/create-warehouse-response.dto';
import { CreateWorkshopValidator } from '../validators/create-workshop.validator';
import { CreateWorkshopDTO } from '../dto/request/create-workshop.dto';
import { CreateWorkshopCommand } from '../commands/create-workshop.command';
import { CreateWorkshopResponseDTO } from '../dto/response/create-workshop-response.dto';

@Injectable()
export class WorkshopService {
  constructor(
    private commandBus: CommandBus,
    private createWorkshopValidator: CreateWorkshopValidator,
  ) {}
  async create(
    createWorkshopDto: CreateWorkshopDTO,
  ): Promise<Result<AppNotification, CreateWorkshopDTO>> {
    const notification: AppNotification =
      await this.createWorkshopValidator.validate(createWorkshopDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const createWorkshopCommand: CreateWorkshopCommand =
      new CreateWorkshopCommand(
        createWorkshopDto.name,
        createWorkshopDto.country,
        createWorkshopDto.district,
        createWorkshopDto.addressDetail,
        createWorkshopDto.ownerId,
      );
    const workshopId = await this.commandBus.execute(createWorkshopCommand);
    const createWorkshopResponseDto: CreateWorkshopResponseDTO =
      new CreateWorkshopResponseDTO(
        workshopId,
        createWorkshopDto.name,
        createWorkshopDto.country,
        createWorkshopDto.district,
        createWorkshopDto.addressDetail,
        createWorkshopDto.ownerId,
      );
    return Result.ok(createWorkshopResponseDto);
  }
}
