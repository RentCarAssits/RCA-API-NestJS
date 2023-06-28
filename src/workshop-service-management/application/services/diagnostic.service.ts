import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDiagnosticValidator } from '../validators/create-diagnostic.validator';
import { CreateDiagnosticDTO } from '../dto/request/create-diagnostic.dto';
import { CreateDiagnosticCommand } from '../commands/create-diagnostic.command';
import { CreateDiagnosticResponseDTO } from '../dto/response/create-diagnostic-response.dto';
import { Diagnostic } from 'src/workshop-service-management/domain/entities/diagnostic.entity';
import { DiagnosticDTO } from '../dto/diagnostic.dto';

@Injectable()
export class DiagnosticService {
  constructor(
    private commandBus: CommandBus,
    private createDiagnosticValidator: CreateDiagnosticValidator,

    @InjectRepository(Diagnostic)
    private diagnosticRepository: Repository<Diagnostic>,
  ) {}
  async create(
    createDiagnosticDto: CreateDiagnosticDTO,
  ): Promise<Result<AppNotification, CreateDiagnosticDTO>> {
    const notification: AppNotification =
      await this.createDiagnosticValidator.validate(createDiagnosticDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const createDiagnosticCommand: CreateDiagnosticCommand =
      new CreateDiagnosticCommand(
        createDiagnosticDto.diagnosticDescription,
        createDiagnosticDto.mechanicId,
        createDiagnosticDto.ownerId,
        createDiagnosticDto.vehicleId,
      );
    const diagnosticId = await this.commandBus.execute(createDiagnosticCommand);
    const createDiagnosticResponseDto: CreateDiagnosticResponseDTO =
      new CreateDiagnosticResponseDTO(
        diagnosticId,
        createDiagnosticDto.diagnosticDescription,
        createDiagnosticDto.ownerId,
        createDiagnosticDto.vehicleId,
        createDiagnosticDto.mechanicId,
      );
    return Result.ok(createDiagnosticResponseDto);
  }

  async findAll(): Promise<Result<AppNotification, DiagnosticDTO[]>> {
    const diagnostic = await this.diagnosticRepository.find();

    const diagnosticDtos: DiagnosticDTO[] = diagnostic.map((diagnostic) => {
      const diagnosticDto = new DiagnosticDTO();
      diagnosticDto.id = Number(diagnostic.getId());
      diagnosticDto.diagnosticDescription =
        diagnostic.getDiagnosticDescription();
      diagnosticDto.ownerId = Number(diagnostic.getOwner().getValue());
      diagnosticDto.vehicleId = Number(diagnostic.getVehicle().getValue());
      diagnosticDto.mechanicId = Number(diagnostic.getMechanic().getValue());
      return diagnosticDto;
    });
    return Result.ok(diagnosticDtos);
  }

  async findbyId(
    diagnosticId,
  ): Promise<Result<AppNotification, DiagnosticDTO>> {
    const diagnostic = await this.diagnosticRepository.findOne({
      where: {
        id: diagnosticId,
      } as FindOptionsWhere<Diagnostic>,
    });
    const diagnosticDto = new DiagnosticDTO();
    diagnosticDto.id = Number(diagnostic.getId());
    diagnosticDto.diagnosticDescription = diagnostic.getDiagnosticDescription();
    diagnosticDto.ownerId = Number(diagnostic.getOwner().getValue());
    diagnosticDto.vehicleId = Number(diagnostic.getVehicle().getValue());
    diagnosticDto.mechanicId = Number(diagnostic.getMechanic().getValue());
    return Result.ok(diagnosticDto);
  }
}
