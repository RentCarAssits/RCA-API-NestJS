import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { UpdateAccountPayable } from "../commands/update-accountPayable.commnad";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountPayableAggregate } from "src/billing-management/domain/aggregates/account-payable";
import { FindOptionsWhere, Repository } from "typeorm";
import { AppNotification } from "src/shared/application/app.notification";
import { Result } from "typescript-result";
import { PayerIdFk } from "src/billing-management/domain/values/payer-id-fk.value";
import { PayeeIdFk } from "src/billing-management/domain/values/payee-id-fk.value";
import { Price } from "src/billing-management/domain/values/price.value";
import { AccountPayableFactory } from "src/billing-management/domain/factories/account-payable.factory";
import { PaymentStatus } from "src/billing-management/domain/enums/payment-status.enum";
import { ServiceType } from "src/billing-management/domain/enums/service-type.enum";
import { AccountPayableId } from "src/billing-management/domain/values/account-payable-id.value";

@CommandHandler(UpdateAccountPayable)
export class UpdateAccountPayableHandler implements ICommandHandler<UpdateAccountPayable> {
    constructor(
        @InjectRepository(AccountPayableAggregate)
        private accountPayableRepository: Repository<AccountPayableAggregate>,
        private publisher: EventPublisher,
    ) { }
    async execute(command: UpdateAccountPayable) {
        let accountPayableId = 0;
        console.log('command: ', command);
        const idAux = command.id;
        console.log('IDDD: ', idAux);
        const accountPayable = await this.accountPayableRepository.findOneBy({
            id: command.id,
        } as FindOptionsWhere<AccountPayableAggregate>);

        const idService = command.serviceId;
        const payerIdResult = PayerIdFk.create(command.payerId);
        const payeeIdResult = PayeeIdFk.create(command.payeeId);
        const priceResult = Price.create(command.totalPrice, command.parcialPrice)
        const expirationDay = command.expirationDay;
        let state: PaymentStatus | undefined;
        switch (command.state) {
            case 'CONFIRMED':
                state = PaymentStatus.CONFIRMED;
                break;
            case 'PENDING':
                state = PaymentStatus.PENDING;
                break;
        }
        const currency = command.currency;
        let tipoServicio: ServiceType | undefined;
        switch (command.tipoServicio) {
            case 'MECANICO':
                tipoServicio = ServiceType.MECANICO;
                break;
            case 'SUSCRIPCION':
                tipoServicio = ServiceType.SUSCRIPCION;
                break;
            case 'RENTA':
                tipoServicio = ServiceType.RENTA;
                break
        }
        const apId = AccountPayableFactory.withId(
            accountPayable.getId(),
            payerIdResult,
            payeeIdResult,
            idService,
            priceResult,
            state,
            expirationDay,
            currency,
            tipoServicio);
        const accountPayableAux = this.accountPayableRepository.create(apId);
        let updatedAccountPayable = await this.accountPayableRepository.save(accountPayableAux);
        if (!updatedAccountPayable) {
            return accountPayableId;
        }
        accountPayableId = Number(updatedAccountPayable.getId());
        console.log('accountPayableId: ', accountPayableId);
        updatedAccountPayable.changeId(AccountPayableId.create(accountPayableId));
        updatedAccountPayable = this.publisher.mergeObjectContext(updatedAccountPayable);
        updatedAccountPayable.updated()
        updatedAccountPayable.commit();
        return accountPayableId;
    }
}