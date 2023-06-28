import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateServiceItemDto } from '../dto/request/create-service-item.dto';
import { CreateServicetItemValidator } from '../validators/create-service-item.validator';
import { CreateServiceItemCommand } from '../commands/create-service-item.command';
import { CreateServiceItemResponseDto } from '../dto/response/create-service-item-response.sto';
import { ServiceItemDto } from '../dto/service-item.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ServiceItem } from 'src/workshop-service-management/domain/entities/service-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal } from 'src/workshop-service-management/domain/entities/proposal.entity';
import { ProposalId } from 'src/workshop-service-management/domain/value-objects/proposal-id.value';
import { ServiceItemId } from '../../domain/value-objects/service-item-id.value';

@Injectable()
export class ServiceItemService {
  constructor(
    private commandBus: CommandBus,
    private createServiceItemValidator: CreateServicetItemValidator,

    @InjectRepository(ServiceItem)
    private serviceItemRepository: Repository<ServiceItem>,

    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
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
  async findAllByProposalId(
    proposalId: number,
  ): Promise<Result<AppNotification, ServiceItemDto[]>> {
    const proposal = await this.proposalRepository.findOne({
      where: {
        id: proposalId,
      } as FindOptionsWhere<Proposal>,
    });
    const serviceItems = await this.serviceItemRepository.find({
      relations: ['proposal'],
      where: {
        proposal: proposal,
      } as FindOptionsWhere<ServiceItem>,
    });
    const serviceItemDtos: ServiceItemDto[] = serviceItems.map(
      (serviceItem) => {
        const serviceItemDto = new ServiceItemDto();
        serviceItemDto.id = Number(serviceItem.getId());
        serviceItemDto.serviceType = serviceItem.getServiceName();
        serviceItemDto.amount = serviceItem.getPrice().getAmount();
        serviceItemDto.currency = serviceItem.getPrice().getCurrency();
        serviceItemDto.resources = serviceItem.getResources();
        serviceItemDto.proposalId = Number(serviceItem.getProposal().getId());
        return serviceItemDto;
      },
    );
    return Result.ok(serviceItemDtos);
  }
  async findbyId(
    serviceItemId: number,
  ): Promise<Result<AppNotification, ServiceItemDto>> {
    console.log(serviceItemId);
    const serviceItem = await this.serviceItemRepository.findOne({
      relations: ['proposal'],
      where: {
        id: serviceItemId,
      } as FindOptionsWhere<ServiceItem>,
    });
    const serviceItemDto = new ServiceItemDto();
    serviceItemDto.id = Number(serviceItem.getId());
    serviceItemDto.serviceType = serviceItem.getServiceName();
    serviceItemDto.amount = serviceItem.getPrice().getAmount();
    serviceItemDto.currency = serviceItem.getPrice().getCurrency();
    serviceItemDto.resources = serviceItem.getResources();
    serviceItemDto.proposalId = Number(serviceItem.getProposal().getId());
    return Result.ok(serviceItemDto);
  }
}
