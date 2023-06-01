import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateProposalCommand } from '../../commands/create-proposal.command';
import { Repository } from 'typeorm';
import { Proposal } from 'src/workshop-service-management/domain/entities/proposal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppNotification } from 'src/shared/application/app.notification';
import { Result } from 'typescript-result';
import { ProposalFactory } from 'src/workshop-service-management/domain/factories/proposal.factory';
import { Price } from 'src/workshop-service-management/domain/value-objects/price.value';
import { Period } from '../../../domain/value-objects/period.value';
import { ProposalId } from 'src/workshop-service-management/domain/value-objects/proposal-id.value';

@CommandHandler(CreateProposalCommand)
export class CreateProposalHandler
  implements ICommandHandler<CreateProposalCommand>
{
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateProposalCommand) {
    let proposalId: number = 0;
    const humanResources = command.humanResources;
    const price = Price.create(command.price, command.currency);
    const period = Period.create(command.start, command.end);
    let proposal: Proposal = ProposalFactory.createFrom(
      humanResources,
      price,
      period,
    );
    let proposalTypeORM = await this.proposalRepository.save(proposal);
    if (proposalTypeORM == null) {
      return proposalId;
    }
    proposalId = Number(proposal.getId());
    proposal.changeId(ProposalId.create(proposalId));
    proposal = this.publisher.mergeObjectContext(proposal);
    proposal.create();
    proposal.commit();
    return proposalId;
  }
}
