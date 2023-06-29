import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateWorkshopValidator } from '../validators/create-workshop.validator';
import { CreateWorkshopDTO } from '../dto/request/create-workshop.dto';
import { CreateWorkshopCommand } from '../commands/create-workshop.command';
import { CreateWorkshopResponseDTO } from '../dto/response/create-workshop-response.dto';
import { WorkshopDTO } from '../dto/workshop.dto';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Workshop } from 'src/workshop-service-management/domain/entities/workshop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MechanicId } from '../../domain/value-objects/mechanic-id.value';

@Injectable()
export class WorkshopService {
  constructor(
    private commandBus: CommandBus,
    private createWorkshopValidator: CreateWorkshopValidator,

    @InjectRepository(Workshop)
    private workshopRepository: Repository<Workshop>,
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
        createWorkshopDto.mechanicId,
      );
    const workshopId = await this.commandBus.execute(createWorkshopCommand);
    const createWorkshopResponseDto: CreateWorkshopResponseDTO =
      new CreateWorkshopResponseDTO(
        workshopId,
        createWorkshopDto.name,
        createWorkshopDto.country,
        createWorkshopDto.district,
        createWorkshopDto.addressDetail,
        createWorkshopDto.mechanicId,
      );
    return Result.ok(createWorkshopResponseDto);
  }
  async findByMechanicId(
    mechanicId: number,
  ): Promise<Result<AppNotification, WorkshopDTO[]>> {
    const workshops = await this.workshopRepository.find({
      where: {
        mechanic: MechanicId.of(mechanicId),
      } as FindOptionsWhere<Workshop>,
    });

    const workshopDtos: WorkshopDTO[] = workshops.map((workshop) => {
      const workshopDto = new WorkshopDTO();
      workshopDto.id = Number(workshop.getId());
      workshopDto.addressDetail = workshop.getName();
      workshopDto.country = workshop.getAddress().getCountry();
      workshopDto.district = workshop.getAddress().getDitrict();
      workshopDto.name = workshop.getName();
      workshopDto.mechanicId = Number(workshop.getMechanic().getValue());
      return workshopDto;
    });
    return Result.ok(workshopDtos);
  }
}
