import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { getAllAccountQuery } from "../../queries/get-all-account.query";
import { AccountDto } from "../../dtos/AccountDto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/subscription-management/domain/entity/account.entity";
import { Subscription } from "src/subscription-management/domain/entity/Subscription.entity";

@QueryHandler(getAllAccountQuery)
export class getAllAccountsHandler implements IQueryHandler<getAllAccountQuery>{
    constructor(@InjectRepository(Account) private readonly AccountRepository: Repository<Account>,){}

    async execute(query: getAllAccountQuery): Promise<any> {
        const accounts = await this.AccountRepository.find({
            relations:{
                Subscriptions:true,
            },
        });
        console.log(
            '🚀 ~ file: Account-queries.handler.ts:18 ~ GetAllAccountsHandler ~ execute ~ accounts:',
            accounts['result'],
        );
        const AccountDtos: AccountDto[] = accounts.map((account)=>{
            const accountDto = new AccountDto();
            accountDto.AccountEmail = account.getAccountEmail().getValue();
            accountDto.AccountNickname = account.getAccountNickname().getValue();
            accountDto.Subscriptions = account.Subscriptions.map((subscription)=>
                subscription.getId().getValue()
            );
            return accountDto;
        });
    }
}


