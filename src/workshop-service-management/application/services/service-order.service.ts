import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProposalValidator } from '../validators/create-proposal.validator';
import { CreateProposalDto } from '../dto/request/create-proposal.dto';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateProposalCommand } from '../commands/create-proposal.command';
import { CreateProposalResponseDto } from '../dto/response/create-proposal-response.dto';
import { ProposalDto } from '../dto/proposal.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Proposal } from 'src/workshop-service-management/domain/entities/proposal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProposalId } from 'src/workshop-service-management/domain/value-objects/proposal-id.value';
import { CreateServiceOrderCommand } from '../commands/create-service-order.command';
import { ServiceOrderDto } from '../dto/service-order.dto';
import { ServiceItem } from 'src/workshop-service-management/domain/entities/service-item.entity';
import { CreateServiceItemOrderCommand } from '../commands/create-service-item-order.command';
import { ServiceOrder } from 'src/workshop-service-management/domain/entities/service-order.entity';
import { ServiceItemDto } from '../dto/service-item.dto';
import { ServiceItemOrderDto } from '../dto/service-item-order';
import { ServiceItemOrder } from 'src/workshop-service-management/domain/entities/service-item-order-entity';

@Injectable()
export class ServiceOrderService {
  constructor(
    private commandBus: CommandBus,

    @InjectRepository(ServiceOrder)
    private serviceOrderRepository: Repository<ServiceOrder>,

    @InjectRepository(ServiceItemOrder)
    private serviceItemRepository: Repository<ServiceItemOrder>,
  ) {}

  async findbyId(
    proposalId: number,
  ): Promise<Result<AppNotification, ProposalDto>> {
    const proposal = await this.serviceOrderRepository.findOne({
      where: {
        id: proposalId,
      } as FindOptionsWhere<Proposal>,
    });
    const proposalDto = new ProposalDto();
    proposalDto.id = Number(proposal.getId());
    proposalDto.humanResources = proposal.getHumanResources();
    proposalDto.amount = proposal.getPrice().getAmount();
    proposalDto.currency = proposal.getPrice().getCurrency();
    proposalDto.start = proposal.getPlannedPeriod().getStart();
    proposalDto.end = proposal.getPlannedPeriod().getEnd();
    return Result.ok(proposalDto);
  }

  async findAll(): Promise<Result<AppNotification, ProposalDto[]>> {
    const proposals = await this.serviceOrderRepository.find();

    const proposalDtos: ProposalDto[] = proposals.map((proposal) => {
      const proposalDto = new ProposalDto();
      proposalDto.id = Number(proposal.getId());
      proposalDto.humanResources = proposal.getHumanResources();
      proposalDto.amount = proposal.getPrice().getAmount();
      proposalDto.currency = proposal.getPrice().getCurrency();
      proposalDto.start = proposal.getPlannedPeriod().getStart();
      proposalDto.end = proposal.getPlannedPeriod().getEnd();
      return proposalDto;
    });
    return Result.ok(proposalDtos);
  }
  async findAllByOrderId(
    serviceOrderId: number,
  ): Promise<Result<AppNotification, ServiceItemOrderDto[]>> {
    const serviceOrder = await this.serviceOrderRepository.findOne({
      where: {
        id: serviceOrderId,
      } as FindOptionsWhere<ServiceOrder>,
    });
    const serviceItems = await this.serviceItemRepository.find({
      relations: ['serviceOrder'],
      where: {
        serviceOrder: serviceOrder,
      } as FindOptionsWhere<ServiceItemOrder>,
    });
    const serviceItemDtos: ServiceItemOrderDto[] = serviceItems.map(
      (serviceItem) => {
        const serviceItemDto = new ServiceItemOrderDto();
        serviceItemDto.id = Number(serviceItem.getId());
        serviceItemDto.serviceName = serviceItem.getServiceName();
        serviceItemDto.amount = serviceItem.getPrice().getAmount();
        serviceItemDto.currency = serviceItem.getPrice().getCurrency();
        serviceItemDto.resources = serviceItem.getResources();
        serviceItemDto.serviceOrderId = Number(
          serviceItem.getServiceOrder().getId(),
        );
        return serviceItemDto;
      },
    );
    return Result.ok(serviceItemDtos);
  }
}
