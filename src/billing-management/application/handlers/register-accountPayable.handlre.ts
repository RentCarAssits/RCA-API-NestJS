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
import { ServiceType } from 'src/billing-management/domain/enums/service-type.enum';

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
      case 'CONFIRMED':
        state=PaymentStatus.CONFIRMED;
        break;
      case 'PENDING':
        state=PaymentStatus.PENDING;
        break;
    }

    let tipoServicio:ServiceType|undefined;
    switch (command.tipoServicio){
      case 'MECANICO':
        tipoServicio=ServiceType.MECANICO;
        break;
      case 'SUSCRIPCION':
        tipoServicio=ServiceType.SUSCRIPCION;
        break;
      case 'RENTA':
        tipoServicio=ServiceType.RENTA;
        break
    }
   
    const payerId:PayerIdFk=PayerIdFk.create(command.payerId);
    const payeeId:PayeeIdFk=PayeeIdFk.create(command.payeeId);
    const serviceId:number=command.serviceId
    const totalPrice:Price=Price.create(command.totalPrice, command.totalPrice);
    const expirationDay:Date= command.expirationDay;
    const currency:string = command.currency;
    const accountPayable:AccountPayableAggregate = AccountPayableFactory.createFrom(
      payerId,
      payeeId,
      serviceId,
      totalPrice,
      state,
      expirationDay,
      currency,
      tipoServicio
    );
    let account=await this.accountPayableRepository.save(accountPayable);
    account.commit();
    return accountPayable.getId();
  }
}