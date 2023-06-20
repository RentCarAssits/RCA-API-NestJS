import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { PaymentId } from '../values/Payment-id.value';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PayerIdFk } from '../values/payer-id-fk.value';

@Entity()
export class PaymentAggregate extends AggregateRoot {
  @PrimaryColumn('bigint', { name: 'id' })
  private paymentId: PaymentId;

  @Column((type) => PayerIdFk, { prefix: false })
  private payerId: PayerIdFk;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.OTHER,
    name: 'payment_method',
  })
  private paymentMethod: PaymentMethod;

  @Column({ type: 'date', name: 'payment_day' })
  private paymentDay: Date;

  constructor(
    idValue: number,
    payerIdValue: number,
    paymentMethod: PaymentMethod,
    paymentDay: Date) {
    super();
    this.paymentId = PaymentId.create(idValue);
    this.payerId = PayerIdFk.create(payerIdValue);
    this.paymentMethod = paymentMethod;
    this.paymentDay = paymentDay;
  }

  public getPaymentId(): PaymentId {
    return this.paymentId;
  }

  public getPayerId(): PayerIdFk {
    return this.payerId;
  }

  public getPaymentMethod(): PaymentMethod {
    return this.paymentMethod;
  }

  public getPaymentDay(): Date {
    return this.paymentDay;
  }
}