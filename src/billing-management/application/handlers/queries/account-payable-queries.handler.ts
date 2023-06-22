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
        const ormAccountPayables = await this.accountPayableRepository.find({
            relations: { id: true },
        });
        console.log(
            '🚀 ~ file: account-payaable-queries.handler.ts:18 ~ GetAllRentingItemsHandler ~ execute ~ rentingItems:',
            ormAccountPayables['result'],
        );
        const accountPayables: AccountPayableDto[] = ormAccountPayables.map(
            function (ormAccountPayables) {
                const accountPayableDto = new AccountPayableDto();
                accountPayableDto.id = Number(ormAccountPayables.getId());
                accountPayableDto.payerId = Number(ormAccountPayables.getPayerId());
                accountPayableDto.payeeId = Number(ormAccountPayables.getPayeeId());
                accountPayableDto.price = ormAccountPayables.getPrice().getParcial();
                accountPayableDto.expirationDay = ormAccountPayables.getExpirationDay();
                return accountPayableDto;
            },
        );
        return accountPayables;
    }
}