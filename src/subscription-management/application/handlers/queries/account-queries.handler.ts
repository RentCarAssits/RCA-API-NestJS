import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { getAllAccountQuery } from "../../queries/get-all-account.query";
import { AccountDto } from "../../dtos/AccountDto";
import { Connection, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/subscription-management/domain/entity/account.entity";
import { getAccountByIdQuery } from "../../queries/get-acount-id.query";

@QueryHandler(getAllAccountQuery)
export class getAllAccountsHandler implements IQueryHandler<getAllAccountQuery>{
    constructor(@InjectRepository(Account) private readonly AccountRepository: Repository<Account>,){}

    async execute(query: getAllAccountQuery): Promise<AccountDto[]> {
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
        return AccountDtos;
    }

}

@QueryHandler(getAccountByIdQuery)
export class GetAccountByIdHandler implements IQueryHandler<getAccountByIdQuery>{
    constructor(
        @InjectRepository(Account)
        private readonly vehicleRepository: Repository<Account>,
        private readonly connection: Connection,
      ) {}

      async execute(query: getAccountByIdQuery){
          const manager = this.connection.manager;
          const sql = 
         `SELECT *
          FROM Accounts
          WHERE vehicles.id = ?`;

        const result = await manager.query(sql,[query.AccountId])

        if(result.length ===0){
            return null;
        }

        const account = result[0];

        const accountDto = new AccountDto();
        accountDto.AccountEmail = account.AccountEmail;
        accountDto.AccountNickname = account.AccountNickname;
        accountDto.AccountEmail = account.Subscriptions ? account.Subscriptions.split(','):[];

        return accountDto;

      }

}

