import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/subscription-management/domain/entity/account.entity";
import { Repository } from "typeorm";
import { RegisterAccountRequest } from "../request/register-account.request";
import { AppNotification } from "src/shared/application/app.notification";

@Injectable()
export class RegisterAccountValidator{
    constructor(@InjectRepository(Account) private accountRepository: Repository<Account>){}

    public async validate(registerAccountRequest: RegisterAccountRequest): Promise<AppNotification>{
        let notification: AppNotification = new AppNotification();
        const email: string = registerAccountRequest.AccountEmail.trim();
        const nickname:string = registerAccountRequest.AccountNickname.trim();
        if(email.length<=0){
            notification.addError('AccountEmail name is required', null);
        }
        if(nickname.length<=0){
            notification.addError('AccountNickname name is required', null);
        }
        if(notification.hasErrors()){
            return notification;
        }

        const account: Account = await this.accountRepository.createQueryBuilder()
                                       .where('name = :name',{name}).getOne();

                                       if(account != null){
                                        notification.addError('Account name is taken', null);   
                                       }
                                       return notification;
    }
}
