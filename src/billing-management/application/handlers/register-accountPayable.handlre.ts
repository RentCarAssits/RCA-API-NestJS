import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountPayable } from '../commands/register-accountPayable.command';
import { AccountPayableAggregate } from 'src/billing-management/domain/aggregates/account-payable';
import { PayerIdFk } from 'src/billing-management/domain/values/payer-id-fk.value';
import { PayeeIdFk } from 'src/billing-management/domain/values/payee-id-fk.value';
import { Price } from 'src/billing-management/domain/values/price.value';
import { AccountPayableFactory } from 'src/billing-management/domain/factories/account-payable.factory';
import { PaymentStatus } from 'src/billing-management/domain/enums/payment-status.enum';

@CommandHandler(CreateAccountPayable)
export class CreateAccountPayableHandler
  implements ICommandHandler<CreateAccountPayable> {
  constructor(
    @InjectRepository(AccountPayableAggregate)
    private accountPayableRepository: Repository<AccountPayableAggregate>
  ) {}

  async execute(command: CreateAccountPayable) {
    let state:PaymentStatus|undefined;
    switch (command.state){
      case 0:
        state=PaymentStatus.CONFIRMED;
        break;
      case 1:
        state=PaymentStatus.PENDING;
        break;
    }
    const fecha = new Date();
    const fecha2 = new Date(fecha.setDate(fecha.getDate() + 30));
    const payerId:PayerIdFk=PayerIdFk.create(command.payerId);
    const payeeId:PayeeIdFk=PayeeIdFk.create(command.payeeId);
    const totalPrice:Price=Price.create(command.totalPrice, command.totalPrice);
    const expirationDay:Date= fecha2;
    const accountPayable:AccountPayableAggregate = AccountPayableFactory.createFrom(
      payerId,
      payeeId,
      totalPrice,
      state,
      expirationDay,
    );
    let account=await this.accountPayableRepository.save(accountPayable);
    account.commit();
    return accountPayable.getId();
  }
}