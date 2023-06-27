import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountPayableAggregateDeleteCommand } from '../commands/delete-accountPayable.command';
import { Repository } from 'typeorm';
import { AccountPayableAggregate } from 'src/billing-management/domain/aggregates/account-payable';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(AccountPayableAggregateDeleteCommand)
export class AccountPayableAggregateDeleteHandler
    implements ICommandHandler<AccountPayableAggregateDeleteCommand>
{
    constructor(
        @InjectRepository(AccountPayableAggregate)
        private accountPayableRepository: Repository<AccountPayableAggregate>,
    ) { }

    async execute(command: AccountPayableAggregateDeleteCommand) {       
        await this.accountPayableRepository.delete(command.id);
    }
}
