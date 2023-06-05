import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { PaymentIdFk } from '../values/payment-id-fk.value';
import { AccountPaybleIdFk } from '../values/account-payable-id-fk.value';
import { Amount } from '../values/amount.value';

@Entity('payment_payable')
export class PaymentPayableAggregate extends AggregateRoot {
  @PrimaryColumn('bigint', { name: 'payment_id' })
  private paymentId: PaymentIdFk;

  @PrimaryColumn('bigint', { name: 'account_payable_id' })
  private accountPayableId: AccountPaybleIdFk;

  @Column({ type:'money' , name: "amount" })
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

  public getPaymentId(): PaymentIdFk {
    return this.paymentId;
  }

  public getAccountPayableId(): AccountPaybleIdFk {
    return this.accountPayableId;
  }

  public getAmount(): Amount {
    return this.amount;
  }

  public updateParcialPrice(){ //PARCIALPRICE=TOTALPRICE-AMOUNT
    //const accountPayable = await this.accountPayableRepository.findOne({ where: { id: this.accountPayableId } }); 
    //TotalPrice= accountPayable.findTotalPricebyAccountPayableId()
    //ParcialPrice=TotalPrice-this.amount
    //updateParcialPrice(ParcialPrice)
  }
}