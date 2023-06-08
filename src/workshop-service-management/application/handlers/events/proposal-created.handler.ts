import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { CreateProposalEvent } from 'src/workshop-service-management/domain/events/create-proposal.event';

@EventsHandler(CreateProposalEvent)
export class ProposalCreatedHandler
  implements IEventHandler<CreateProposalEvent>
{
  constructor() {}

  handle(event: CreateProposalEvent) {
    console.log('handle logic for renting item Created event');
    console.log(event);
  }
}
