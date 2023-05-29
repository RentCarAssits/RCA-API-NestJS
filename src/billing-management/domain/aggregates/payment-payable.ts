import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { PaymentId } from '../values/Payment-id.value';
import { AccountPayableId } from '../values/account-payable-id.value';
import { Amount } from '../values/amount.value';

@Entity()
export class PaymentPayableAggregate extends AggregateRoot {
  @PrimaryColumn('bigint', { name: 'id' })
  private paymentId: PaymentId;

  @Column((type) => AccountPayableId, { prefix: false })
  private accountPayableId: AccountPayableId;

  @Column((type) => Amount, { prefix: false })
  private amount: Amount;



  constructor(
    idValue: number
    , accountPayableIdValue: number
    , amountValue: number ) 
    {
    super();
    this.paymentId = PaymentId.create(idValue);
    this.accountPayableId = AccountPayableId.create(accountPayableIdValue);
    this.amount = Amount.create(amountValue);
  }

  public getPaymentId(): PaymentId {
    return this.paymentId;
  }

  public getAccountPayableId(): AccountPayableId {
    return this.accountPayableId;
  }

  public getAmount(): Amount {
    return this.amount;
  }
}