import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateServiceRequestValidator } from '../validators/create-service-request.validator';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateServiceRequest } from '../commands/create-service-request.command';
import { ServiceRequestResponseDto } from '../dto/response/service-request-response.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ServiceRequest } from '../../domain/entities/service-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequestDto } from '../dto/service-request.dto';
import { CreateServiceRequestDto } from '../dto/request/service-request.dto';
import { GetServiceRequestVehiclesResponseDto } from '../dto/response/get-service-request-vehicles-response.dto';
import { OwnerId } from '../../domain/value-objects/owner-id.value';

@Injectable()
export class ServiceRequestService {
  constructor(
    private commandBus: CommandBus,
    private createServiceRequestValidator: CreateServiceRequestValidator,

    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
  ) {}

  async create(
    serviceRequestDto: CreateServiceRequestDto,
  ): Promise<Result<AppNotification, CreateServiceRequestDto>> {
    const notification: AppNotification =
      await this.createServiceRequestValidator.validate(serviceRequestDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    console.log(notification);
    const createServiceRequestCommand: CreateServiceRequest =
      new CreateServiceRequest(
        serviceRequestDto.descriptionProblems,
        serviceRequestDto.workshopId,
        serviceRequestDto.ownerId,
        serviceRequestDto.vehicleId,
        serviceRequestDto.vehicleName,
        serviceRequestDto.year,
        serviceRequestDto.vehicleIntegrity,
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
        createServiceRequestCommand.vehicleName,
        createServiceRequestCommand.year,
        createServiceRequestCommand.vehicleIntegrity,
      );

    return Result.ok(serviceRequestResponseDto);
  }
  async findAllByOwner(
    ownerId: number,
  ): Promise<Result<AppNotification, ServiceRequestDto[]>> {
    const serviceRequests = await this.serviceRequestRepository.find({
      where: {
        owner: OwnerId.of(ownerId),
      } as FindOptionsWhere<ServiceRequest>,
    });

    const serviceRequestDtos: ServiceRequestDto[] = serviceRequests.map(
      (serviceRequest) => {
        const serviceRequestDto = new ServiceRequestDto();
        serviceRequestDto.id = Number(serviceRequest.getId());
        serviceRequestDto.descriptionProblems =
          serviceRequest.getDescriptionProblem();
        serviceRequestDto.ownerId = Number(
          serviceRequest.getOwner().getValue(),
        );
        serviceRequestDto.vehicleId = Number(
          serviceRequest.getVehicle().getValue(),
        );
        serviceRequestDto.workshopId = Number(
          serviceRequest.getWorkshop().getValue(),
        );
        serviceRequestDto.vehicleName = serviceRequest.geteVehicleName();
        serviceRequestDto.year = serviceRequest.getYear();
        serviceRequestDto.vehicleIntegrity =
          serviceRequest.getVehicleIntegrity();
        return serviceRequestDto;
      },
    );
    return Result.ok(serviceRequestDtos);
  }
  async findAll(): Promise<Result<AppNotification, ServiceRequestDto[]>> {
    const serviceRequests = await this.serviceRequestRepository.find();

    const serviceRequestDtos: ServiceRequestDto[] = serviceRequests.map(
      (serviceRequest) => {
        const serviceRequestDto = new ServiceRequestDto();
        serviceRequestDto.id = Number(serviceRequest.getId());
        serviceRequestDto.descriptionProblems =
          serviceRequest.getDescriptionProblem();
        serviceRequestDto.ownerId = Number(
          serviceRequest.getOwner().getValue(),
        );
        serviceRequestDto.vehicleId = Number(
          serviceRequest.getVehicle().getValue(),
        );
        serviceRequestDto.workshopId = Number(
          serviceRequest.getWorkshop().getValue(),
        );
        serviceRequestDto.vehicleName = serviceRequest.geteVehicleName();
        serviceRequestDto.year = serviceRequest.getYear();
        serviceRequestDto.vehicleIntegrity =
          serviceRequest.getVehicleIntegrity();
        return serviceRequestDto;
      },
    );
    return Result.ok(serviceRequestDtos);
  }

  async findbyId(
    serviceRequestId,
  ): Promise<Result<AppNotification, ServiceRequestDto>> {
    const serviceRequest = await this.serviceRequestRepository.findOne({
      where: {
        id: serviceRequestId,
      } as FindOptionsWhere<ServiceRequest>,
    });
    const serviceRequestDto = new ServiceRequestDto();
    serviceRequestDto.id = Number(serviceRequest.getId());
    serviceRequestDto.descriptionProblems =
      serviceRequest.getDescriptionProblem();
    serviceRequestDto.ownerId = Number(serviceRequest.getOwner().getValue());
    serviceRequestDto.vehicleId = Number(
      serviceRequest.getVehicle().getValue(),
    );
    serviceRequestDto.workshopId = Number(
      serviceRequest.getWorkshop().getValue(),
    );
    serviceRequestDto.vehicleName = serviceRequest.geteVehicleName();
    serviceRequestDto.year = serviceRequest.getYear();
    serviceRequestDto.vehicleIntegrity = serviceRequest.getVehicleIntegrity();
    return Result.ok(serviceRequestDto);
  }

  async findAllVehiclesbyId(): Promise<
    Result<AppNotification, GetServiceRequestVehiclesResponseDto[]>
  > {
    const serviceRequests = await this.serviceRequestRepository.find();
    const serviceRequestDtos: GetServiceRequestVehiclesResponseDto[] =
      serviceRequests.map((serviceRequest) => {
        const serviceRequestDto = new GetServiceRequestVehiclesResponseDto();
        serviceRequestDto.id = Number(serviceRequest.getId());
        serviceRequestDto.vehicleId = Number(
          serviceRequest.getVehicle().getValue(),
        );
        serviceRequestDto.vehicleName = serviceRequest.geteVehicleName();
        serviceRequestDto.year = serviceRequest.getYear();
        serviceRequestDto.vehicleIntegrity =
          serviceRequest.getVehicleIntegrity();
        return serviceRequestDto;
      });
    return Result.ok(serviceRequestDtos);
  }
}
