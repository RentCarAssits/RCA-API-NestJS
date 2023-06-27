import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProposalValidator } from '../validators/create-proposal.validator';
import { CreateProposalDto } from '../dto/request/create-proposal.dto';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateProposalCommand } from '../commands/create-proposal.command';
import { CreateProposalResponseDto } from '../dto/response/create-proposal-response.dto';

@Injectable()
export class ProposalService {
  constructor(
    private commandBus: CommandBus,
    private createProposalValidator: CreateProposalValidator,
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
}
