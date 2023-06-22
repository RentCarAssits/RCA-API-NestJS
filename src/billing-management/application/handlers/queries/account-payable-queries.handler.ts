import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllAccountPayablesQuery } from "../../queries/get-all-account-payables-query";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountPayableAggregate } from "src/billing-management/domain/aggregates/account-payable";
import { Repository } from "typeorm";
import { AccountPayableDto } from "../../dtos/account-payable.dto";

@QueryHandler(GetAllAccountPayablesQuery)
export class AccountPayablesQueriesHandler
    implements IQueryHandler<GetAllAccountPayablesQuery>
{
    constructor(
        @InjectRepository(AccountPayableAggregate)
        private readonly accountPayableRepository: Repository<AccountPayableAggregate>
    ) { }
    
    async execute(
        query: GetAllAccountPayablesQuery
    ): Promise<AccountPayableDto[]> {
        const ormAccountPayables = await this.accountPayableRepository.find();
        console.log(
            '🚀 ~ file: account-payaable-queries.handler.ts:18 ~ GetAllRentingItemsHandler ~ execute ~ rentingItems:',
            ormAccountPayables['result'],
        );
        const accountPayables: AccountPayableDto[] = ormAccountPayables.map(
          (ormAccountPayables)  => {
                const accountPayableDto = new AccountPayableDto();
                accountPayableDto.id = Number(ormAccountPayables.getId());
                accountPayableDto.payerId = Number(ormAccountPayables.payerId?ormAccountPayables.payerId.getValue():null);
                accountPayableDto.payeeId = Number(ormAccountPayables.payeeId?ormAccountPayables.payeeId.getValue():null);
                accountPayableDto.totalPrice = ormAccountPayables.getPrice().getValue();
                accountPayableDto.parcialPrice = ormAccountPayables.getPrice().getParcial();
                accountPayableDto.expirationDay = ormAccountPayables.getExpirationDay();
                accountPayableDto.state=ormAccountPayables.getState();
                return accountPayableDto;
            },
        );
        return accountPayables;
    }
}