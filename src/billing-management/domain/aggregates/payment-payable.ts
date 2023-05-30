import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn, ValueTransformer } from 'typeorm';
import { PaymentIdFk } from '../values/payment-id-fk.value';
import { AccountPayableId } from '../values/account-payable-id.value';
import { Amount } from '../values/amount.value';

@Entity()
export class PaymentPayableAggregate extends AggregateRoot {
  @PrimaryColumn('bigint', { name: 'id' })
  private paymentId: PaymentIdFk;

  @Column({
    type: 'bigint',
    name: 'account_payable_id',
    transformer: {
      to: (value: AccountPayableId) => value.getValue(),
      from: (value: number) => AccountPayableId.create(value),
    },
  })
  private accountPayableId: AccountPayableId;

  @Column((type) => Amount)
  private amount: Amount;

  constructor(
    idValue: number,
    accountPayableIdValue: number,
    amountValue: number
  ) {
    super();
    this.paymentId = PaymentIdFk.create(idValue);
    this.accountPayableId = AccountPayableId.create(accountPayableIdValue);
    this.amount = Amount.create(amountValue);
  }

  public getPaymentId(): PaymentIdFk {
    return this.paymentId;
  }

  public getAccountPayableId(): AccountPayableId {
    return this.accountPayableId;
  }

  public getAmount(): Amount {
    return this.amount;
  }
}