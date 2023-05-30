import { AggregateRoot } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn,OneToMany } from "typeorm";
import { AccountId } from "../values/account-id.value";
import { AccountEmail } from "../values/account-email.value";
import { AccountNickname } from "../values/account-nickname.value";
import { Subscription } from "./Subscription.entity";
import { SubscriptionId } from "../values/subscription-id.value";

@Entity('Accounts')
export class Account extends AggregateRoot {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  private id: AccountId;

  @ApiProperty()
  @Column(()=>AccountEmail,{prefix:false})
  private AccountEmail: AccountEmail;

  @ApiProperty()
  @Column(()=>AccountNickname,{prefix:false})
  private AccountNickname: AccountNickname;

  @ApiProperty()
  @OneToMany(()=> Subscription,(Subscription) => Subscription.Account,{
    onDelete:'CASCADE',
    eager:true,
  })
  Subscriptions: Subscription[];


  public constructor(AccountEmail: AccountEmail, AccountName:AccountNickname) {
    super();
    this.AccountEmail = AccountEmail;
    this.AccountNickname=AccountName;
  }

  public getAccountEmail():AccountEmail{
    return this.AccountEmail;
  }

  public getAccountNickname():AccountNickname{
    return this.AccountNickname;
  }

  public changeId(accountId: AccountId) {
    this.id  = accountId;
  }

}
