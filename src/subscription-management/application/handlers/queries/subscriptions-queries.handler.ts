import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { getAllSubscriptionQuery } from "../../queries/get-all-subscription.query";
import { Subscription } from "src/subscription-management/domain/entity/Subscription.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { SubscriptionDto } from "../../dtos/SubscriptionDto";
import { getSubscriptionByIdQuery } from "../../queries/get-subscription-id.query";

//AQUI REVISAR QUE ESTA FALLANDO CON MI SQL
@QueryHandler(getAllSubscriptionQuery)
export class GetAllSubscriptionHandler implements IQueryHandler<getAllSubscriptionQuery>{
  constructor(@InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>,private readonly connection: Connection,) {}
  
  async execute(query: getAllSubscriptionQuery): Promise<SubscriptionDto[]> {
    const manager = this.connection.manager;
    const sql = 'SELECT * FROM Subscriptions';
    const result = await manager.query(sql);
    if(result.length === 0){
      console.log("Not result in repository now. Sorry come back later please");
      return null;
    }
    console.log(result);
    
    const subscriptionsDto: SubscriptionDto[] = result.map((subscriptions)=>{
      const subscriptionDto = new SubscriptionDto();
      subscriptionDto.SubscriptionId = subscriptions.id;
      subscriptionDto.PlanId = subscriptions.planIdId;   
      subscriptionDto.AccountId = subscriptions.accountIdId; 
      subscriptionDto.Frequency = subscriptions.frequency;
      subscriptionDto.UnitPrice = subscriptions.unitPrice;
      subscriptionDto.startDate = subscriptions.startDate;
      subscriptionDto.endDate = subscriptions.endDate;
      return subscriptionDto;
    })
    console.log("ACA DTO");
    console.log(SubscriptionDto);
    return subscriptionsDto;
  }    
}



@QueryHandler(getSubscriptionByIdQuery)
export class GetSubscriptionByIdHanlder implements IQueryHandler<getSubscriptionByIdQuery>{
    constructor(@InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>,private readonly connection: Connection,) {}

    async execute(query: getSubscriptionByIdQuery){
        const manager = this.connection.manager;
        const sql=`SELECT *   
          FROM Subscriptions as S
          WHERE S.id = ?`;
        const result = await manager.query(sql, [query.SubscriptionId]);

        if(result.length === 0){
            console.log('Not result in repository now. Sorry come back in other moment please');
            return null;
        }
        const subscription = result[0];

        console.log("Subscription",subscription);

        const subscriptionDto = new SubscriptionDto();
        subscriptionDto.AccountId = subscription.accountId;
        subscriptionDto.PlanId = subscription.planId;
        subscriptionDto.UnitPrice = subscription.unitPrice;
        subscriptionDto.Frequency = subscription.frequency;
        subscriptionDto.startDate = subscription.startDate;
        subscriptionDto.endDate = subscription.endDate;
        
        console.log("accountId dto: --> ",subscriptionDto.AccountId, "accountId --> normal", subscription.accountId);
        return subscriptionDto;
    }
    
}
