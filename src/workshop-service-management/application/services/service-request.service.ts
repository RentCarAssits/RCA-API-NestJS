import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateServiceRequestValidator } from '../validators/create-service-request.validator';
import { ServiceRequestDto } from '../dto/request/service-request.dto';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateServiceRequest } from '../commands/create-service-request.command';
import { ServiceRequestResponseDto } from '../dto/response/service-request-response.dto';

@Injectable()
export class ServiceRequestService {
  constructor(
    private commandBus: CommandBus,
    private createServiceRequestValidator: CreateServiceRequestValidator,
  ) {}

  async create(
    serviceRequestDto: ServiceRequestDto,
  ): Promise<Result<AppNotification, ServiceRequestDto>> {
    const notification: AppNotification =
      await this.createServiceRequestValidator.validate(serviceRequestDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }

    const createServiceRequestCommand: CreateServiceRequest =
      new CreateServiceRequest(
        serviceRequestDto.descriptionProblems,
        serviceRequestDto.workshopId,
        serviceRequestDto.ownerId,
        serviceRequestDto.vehicleId,
      );

    const serviceRequestId = await this.commandBus.execute(
      createServiceRequestCommand,
    );

    const serviceRequestResponseDto: ServiceRequestResponseDto =
      new ServiceRequestResponseDto(
        serviceRequestId,
        createServiceRequestCommand.descriptionProblems,
        createServiceRequestCommand.workshopId,
        createServiceRequestCommand.ownerId,
        createServiceRequestCommand.vehicleId,
      );

    return Result.ok(serviceRequestResponseDto);
  }
}
