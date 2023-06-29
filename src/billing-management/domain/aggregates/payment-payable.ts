import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentIdFk } from '../values/payment-id-fk.value';
import { AccountPaybleIdFk } from '../values/account-payable-id-fk.value';
import { Amount } from '../values/amount.value';

@Entity('payment_payables')
export class PaymentPayableAggregate extends AggregateRoot {

  @PrimaryGeneratedColumn({ name: 'id' })
  private id: number;

  @Column((type) => PaymentIdFk, { prefix: false })

  private readonly paymentId: PaymentIdFk;

  @Column((type) => AccountPaybleIdFk, { prefix: false })
  private readonly accountPayableId: AccountPaybleIdFk;

  @Column((type) => Amount, { prefix: false })
  private amount: Amount;

  public constructor(
    paymentId: PaymentIdFk,
    accountPayableId: AccountPaybleIdFk,
    amountValue: Amount) { //Cuando creas el paymentPayable, le pasas la id del pago, la id de la deuda que esta pagando y el monto que esta pagando
    super();
    this.paymentId = paymentId;
    this.accountPayableId = accountPayableId;
    this.amount = amountValue;
  }

  public getId(): number {
    return this.id;
  }
  public getPaymentId(): PaymentIdFk {
    return this.paymentId;
  }

  public getAccountPayableId(): AccountPaybleIdFk {
    return this.accountPayableId;
  }

  public getAmount(): Amount {
    return this.amount;
  }
}