import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllAccountPayablesQuery } from "../../queries/get-all-account-payables-query";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountPayableAggregate } from "src/billing-management/domain/aggregates/account-payable";
import { Connection, Repository } from "typeorm";
import { AccountPayableDto } from "../../dtos/account-payable.dto";
import { GetAccountPayableByIdQuery } from "../../queries/get-account-payable-by-id.query";

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
            (ormAccountPayables) => {
                const accountPayableDto = new AccountPayableDto();
                accountPayableDto.id = Number(ormAccountPayables.getId());
                accountPayableDto.payerId = Number(ormAccountPayables.payerId ? ormAccountPayables.payerId.getValue() : null);
                accountPayableDto.payeeId = Number(ormAccountPayables.payeeId ? ormAccountPayables.payeeId.getValue() : null);
                accountPayableDto.totalPrice = ormAccountPayables.getPrice().getValue();
                accountPayableDto.parcialPrice = ormAccountPayables.getPrice().getParcial();
                accountPayableDto.expirationDay = ormAccountPayables.getExpirationDay();
                accountPayableDto.state = ormAccountPayables.getState();
                return accountPayableDto;
            },
        );
        return accountPayables;
    }
}

@QueryHandler(GetAccountPayableByIdQuery)
export class GetAccountPayableByIdHandler
    implements IQueryHandler<GetAccountPayableByIdQuery> {
    constructor(
        @InjectRepository(AccountPayableAggregate)
        private readonly accountPayableRepository: Repository<AccountPayableAggregate>,
        private readonly connection: Connection
    ){}

    async execute(query: GetAccountPayableByIdQuery){
        const manager = this.connection.manager;
        const sql = `SELECT * FROM account_payables WHERE id = ${query.id}`
        const result = await manager.query(sql,[query.id]);

        if(result.length == 0){
            return null;
        }
        const accountPayable=result[0];
        const accountPayableDto = new AccountPayableDto();
        accountPayableDto.id = Number(accountPayable.id);
        accountPayableDto.payerId = Number(accountPayable.payer_id);
        accountPayableDto.payeeId = Number(accountPayable.payee_id);
        accountPayableDto.totalPrice = accountPayable.total_price;
        accountPayableDto.parcialPrice = accountPayable.parcial_price;
        accountPayableDto.expirationDay = accountPayable.expiration_day;
        accountPayableDto.state = accountPayable.state;
        return accountPayableDto;
    }
}