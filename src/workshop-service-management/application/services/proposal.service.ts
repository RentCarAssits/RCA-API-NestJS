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

@Injectable()
export class ProposalService {
  constructor(
    private commandBus: CommandBus,
    private createProposalValidator: CreateProposalValidator,

    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
  ) {}
  async create(
    createProposalDto: CreateProposalDto,
  ): Promise<Result<AppNotification, CreateProposalDto>> {
    const notification: AppNotification =
      await this.createProposalValidator.validate(createProposalDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const createProposalCommand: CreateProposalCommand =
      new CreateProposalCommand(
        createProposalDto.humanResources,
        createProposalDto.amount,
        createProposalDto.currency,
        createProposalDto.start,
        createProposalDto.end,
      );
    const proposalId = await this.commandBus.execute(createProposalCommand);
    const createProposalResponseDto: CreateProposalResponseDto =
      new CreateProposalResponseDto(
        proposalId,
        createProposalDto.humanResources,
        createProposalDto.amount,
        createProposalDto.currency,
        createProposalDto.start,
        createProposalDto.end,
      );
    return Result.ok(createProposalResponseDto);
  }

  async findbyId(
    proposalId: number,
  ): Promise<Result<AppNotification, ProposalDto>> {
    const proposal = await this.proposalRepository.findOne({
      where: {
        id: proposalId,
      } as FindOptionsWhere<Proposal>,
    });
    const proposalDto = new ProposalDto();
    proposalDto.id = Number(proposal.getId());
    proposalDto.humanResources = proposal.getHumanResources();
    proposalDto.amount = proposal.getPrice().getAmount();
    proposalDto.currency = proposal.getPrice().getCurrency();
    proposalDto.start = proposal.getPeriod().getStart();
    proposalDto.end = proposal.getPeriod().getEnd();
    return Result.ok(proposalDto);
  }

  async findAll(): Promise<Result<AppNotification, ProposalDto[]>> {
    const proposals = await this.proposalRepository.find();

    const proposalDtos: ProposalDto[] = proposals.map((proposal) => {
      const proposalDto = new ProposalDto();
      proposalDto.id = Number(proposal.getId());
      proposalDto.humanResources = proposal.getHumanResources();
      proposalDto.amount = proposal.getPrice().getAmount();
      proposalDto.currency = proposal.getPrice().getCurrency();
      proposalDto.start = proposal.getPeriod().getStart();
      proposalDto.end = proposal.getPeriod().getEnd();
      return proposalDto;
    });
    return Result.ok(proposalDtos);
  }
}
