import { AggregateRoot } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn,ManyToOne } from "typeorm";
import { SubscriptionId } from "../values/subscription-id.value";
import { Period } from "../values/period.value";
import { Plan } from "./plan.entity";
import { Account } from "./account.entity";
import { SubscriptionFrequency } from "../values/subscription-frequency.value";
import { RegisterVehicleHandler } from "src/subscription-management/application/handlers/commands/register-account.handler";
import { SubscriptionRegistered } from "../events/subscription-registered.event";

@Entity('Subscriptions')
export class Subscription extends AggregateRoot{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    private id: SubscriptionId;
    
    @ApiProperty()
    @ManyToOne(()=> Account, (Account)=> Account.Subscriptions,{
        onDelete:'CASCADE',
    })
    Account: Account;

    @OneToOne(()=>Plan)
    @JoinColumn()
    private readonly Plan:Plan;
    
    @ApiProperty()
    @Column()
    private readonly UnitPrice: number;

    @ApiProperty()
    @Column()
    private readonly Frequency:SubscriptionFrequency;

    @ApiProperty()
    @Column(()=>Period,{prefix:false})
    private readonly Period: Period;

    public constructor(
        
        UnitPrice:number,
        Frequency: SubscriptionFrequency,
        Period: Period) {
        super();
         
        this.UnitPrice=UnitPrice;
        this.Frequency=Frequency;
        this.Period=Period;
    }

    public register(){
        const event = new SubscriptionRegistered(
            this.id.getValue(),
            this.Account.getAccountId().getValue(),
            this.Plan.getId().getValue(),
            this.UnitPrice,
            this.Frequency.getValue(),
            this.Period.getStartDate(),
        ); 
        this.apply(event);
    }

    public getId(): SubscriptionId{
        return this.id;
    }
}