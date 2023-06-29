import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { getAllSubscriptionQuery } from "../../queries/get-all-subscription.query";
import { Subscription } from "src/subscription-management/domain/entity/Subscription.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { SubscriptionDto } from "../../dtos/SubscriptionDto";
import { getSubscriptionByIdQuery } from "../../queries/get-subscription-id.query";
import { getUserSubscriptionQuery } from "../../queries/get-User-Subscription.query";
import { CurrentUserPlanDto } from "../../dtos/CurrentUserPlan";
import { User } from "src/iam-management/domain/entities/user.entity";

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
      subscriptionDto.discount = subscriptions.Subscriptiondiscount;
      subscriptionDto.PlanId = subscriptions.planId;   
      subscriptionDto.AccountId = subscriptions.accountId; 
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
        subscriptionDto.discount = subscription.Subscriptiondiscount;

        console.log("accountId dto: --> ",subscriptionDto.AccountId, "accountId --> normal", subscription.accountId);
        return subscriptionDto;
    }
    
}


@QueryHandler(getUserSubscriptionQuery)
export class GetUserSubscriptionHandler implements IQueryHandler<getUserSubscriptionQuery>{
  constructor(@InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>, private readonly connection: Connection,){} 
  
  async execute(query: getUserSubscriptionQuery): Promise<any> {
    const manager = this.connection.manager;
    
    const sql = 
    `select MAX(S.startDate),S.endDate,P.name, P.Benefits
    from Subscriptions as S
    Inner Join accounts as A on A.id = S.accountId
    Inner Join users as U on U.id = A.id
    Inner Join plans as P on P.id = S.planId
    where A.id = 1
    group by S.endDate,P.name, P.Benefits`;
   
   
    const result = await manager.query(sql,[query.userId]);

    if(result.length === 0){
      console.log('Not result in repository now. Sorry come back in other moment please');
      return null;
    }

    const UserPlan = result[0];
    console.log("UserPlan: ",UserPlan);
 

    const currentUserPlanDto = new CurrentUserPlanDto();
    currentUserPlanDto.PlanName = UserPlan.name;
    currentUserPlanDto.Benefits = UserPlan.Benefits;
    currentUserPlanDto.startDate = UserPlan.startDate;
    currentUserPlanDto.endDate = UserPlan.endDate;

    return currentUserPlanDto;
  }


 
}