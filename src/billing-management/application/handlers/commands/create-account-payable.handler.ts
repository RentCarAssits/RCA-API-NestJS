import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterAccountPayable } from "../../commands/register-account-payable.command";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountPayable } from "src/billing-management/domain/entities/account-payable.entity";
import { Repository } from "typeorm";
import { PayerIdFk } from "src/billing-management/domain/values/payer-id-fk.value";
import { PayeeIdFk } from "src/billing-management/domain/values/payee-id-fk.value";
import { Price } from "src/billing-management/domain/values/price.value";
import { AccountPayableFactory } from "src/billing-management/domain/factories/account-payable.factory";

@CommandHandler(RegisterAccountPayable)
export class CreateAccountPayableHandler implements ICommandHandler<RegisterAccountPayable>{
    constructor(
        @InjectRepository(AccountPayable)
        private accountPayableRepository: Repository<AccountPayable>
    ) { }

    async execute(command: RegisterAccountPayable){
        const fechaActual = new Date();
        const fechaExpiracion = new Date(fechaActual.setMonth(fechaActual.getMonth()+1));
        const payerId:PayerIdFk=PayerIdFk.of(command.payerId);
        const payeeId:PayeeIdFk=PayeeIdFk.of(command.payeeId);
        const totalPrice:Price=Price.create(command.totalPrice, command.totalPrice);
        const expirationDay:Date= fechaExpiracion;

        const accountPayable:AccountPayable = AccountPayableFactory.createFrom(
          payerId,
          payeeId,
          totalPrice,
          expirationDay,
        );
        let account=await this.accountPayableRepository.save(accountPayable);
        account.register();
        account.commit();
        return accountPayable.getId();
      }
}