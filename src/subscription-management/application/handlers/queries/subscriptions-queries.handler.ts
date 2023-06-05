import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { getAllSubscriptionQuery } from "../../queries/get-all-subscription.query";
import { Subscription } from "src/subscription-management/domain/entity/Subscription.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { SubscriptionDto } from "../../dtos/SubscriptionDto";
import { getSubscriptionByIdQuery } from "../../queries/get-subscription-id.query";

@QueryHandler(getAllSubscriptionQuery)
export class GetAllSubscriptionHandler implements IQueryHandler<getAllSubscriptionQuery>{
  constructor(@InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>,) {}
  
  async execute(query: getAllSubscriptionQuery): Promise<SubscriptionDto[]> {
    const subscriptions = await this.subscriptionRepository.find();
    //console.log('🚀 ~ file: subscriptions-queries.handler.ts:18 ~ GetAllSubscriptionsHandler ~ execute ~ subscriptions:',subscriptions['result'],); 
    
    const subscriptionDtos: SubscriptionDto[] = subscriptions.map((subscriptions)=>{
      const subscriptionDto = new SubscriptionDto();
      subscriptionDto.Frequency = subscriptions.getFrequency().getValue();
      subscriptionDto.UnitPrice = subscriptions.getUnitPrice();
      subscriptionDto.startDate = subscriptions.getPeriod().getStartDate();
      subscriptionDto.endDate = subscriptions.getPeriod().getEndDate();

      return subscriptionDto;
    })
    return subscriptionDtos;
  }    
}


@QueryHandler(getSubscriptionByIdQuery)
export class GetSubscriptionByIdHanlder implements IQueryHandler<getSubscriptionByIdQuery>{
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>,
        private readonly connection: Connection,
    ) {}

    async execute(query: getSubscriptionByIdQuery){
        const manager = this.connection.manager;
        const sql=`SELECT *   
          FROM Subscriptions as S
          WHERE S.id = ?`;
        const result = await manager.query(sql, [query.SubscriptionId]);

        if(result.length === 0){
            return null;
            console.log('Not result in repository now. Sorry come back in other moment please');
        }
        const subscription = result[0];

        console.log("Subscription",subscription);

        const subscriptionDto = new SubscriptionDto();
        
        //subscriptionDto.AccountId = subscription.AccountId;
        subscriptionDto.PlanId = subscription.planId;
        subscriptionDto.UnitPrice = subscription.unitPrice;
        subscriptionDto.Frequency = subscription.frequency;
        subscriptionDto.startDate = subscription.startDate;
        subscriptionDto.endDate = subscription.endDate;
        
        return subscriptionDto;
    }
    
}
