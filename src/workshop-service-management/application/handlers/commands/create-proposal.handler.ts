import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateProposalCommand } from '../../commands/create-proposal.command';
import { Repository } from 'typeorm';
import { Proposal } from 'src/workshop-service-management/domain/entities/proposal.entity';
import { InjectRepository } from '@nestjs/typeorm';
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
    const price = Price.create(command.amount, command.currency);
    const period = Period.create(command.start, command.end);
    let proposal: Proposal = ProposalFactory.createFrom(
      humanResources,
      price,
      period,
    );
    const aux = proposal;
    const proposalAux = this.proposalRepository.create(aux);
    let proposalTypeORM = await this.proposalRepository.save(proposalAux);
    if (proposalTypeORM == null) {
      return proposalId;
    }
    proposalId = Number(proposalTypeORM.getId());
    proposalTypeORM.changeId(ProposalId.of(proposalId));
    proposalTypeORM = this.publisher.mergeObjectContext(proposalTypeORM);
    proposalTypeORM.create();
    proposalTypeORM.commit();
    return proposalId;
  }
}
