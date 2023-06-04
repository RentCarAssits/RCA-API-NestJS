import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountPayable } from '../commands/register-accountPayable.command';
import { AccountPayableAggregate } from 'src/billing-management/domain/aggregates/account-payable';
import { PayerIdFk } from 'src/billing-management/domain/values/payer-id-fk.value';
import { PayeeIdFk } from 'src/billing-management/domain/values/payee-id-fk.value';
import { Price } from 'src/billing-management/domain/values/price.value';
import { AccountPayableFactory } from 'src/billing-management/domain/factories/account-payable.factory';

@CommandHandler(CreateAccountPayable)
export class CreateAccountPayableHandler
  implements ICommandHandler<CreateAccountPayable> {
  constructor(
    @InjectRepository(AccountPayableAggregate)
    private accountPayableRepository: Repository<AccountPayableAggregate>,
  ) {}

  async execute(command: CreateAccountPayable) {
    const payerId:PayerIdFk=PayerIdFk.create(command.payerId);
    const payeeId:PayeeIdFk=PayeeIdFk.create(command.payeeId);
    const totalPrice:Price=Price.create(command.totalPrice);
    const expirationDay:Date= new Date;
    const accountPayable:AccountPayableAggregate = AccountPayableFactory.createFrom(
      payerId,
      payeeId,
      totalPrice,
      expirationDay,
    );
    let account=await this.accountPayableRepository.save(accountPayable);
    account.commit();
    return accountPayable.getId();
  }
}