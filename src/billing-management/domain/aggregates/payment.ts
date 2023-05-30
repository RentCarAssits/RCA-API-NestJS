import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn,PrimaryGeneratedColumn } from 'typeorm';
import { PaymentId } from '../values/Payment-id.value';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PayerId } from '../values/payer-id-fk.value';

@Entity()
export class PaymentAggregate extends AggregateRoot {
  @PrimaryGeneratedColumn({ name: 'id' })
  private paymentId: PaymentId;

  @Column((type) => PayerId, { prefix: false })
  private payerId: PayerId;

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
    payerIdValue: number, 
    paymentMethod: PaymentMethod, 
    paymentDay: Date) 
    {
    super();
    this.payerId = PayerId.create(payerIdValue);
    this.paymentMethod = paymentMethod;
    this.paymentDay = paymentDay;
  }

  public getPaymentId(): PaymentId {
    return this.paymentId;
  }

  public getPayerId(): PayerId {
    return this.payerId;
  }

  public getPaymentMethod(): PaymentMethod {
    return this.paymentMethod;
  }

  public getPaymentDay(): Date {
    return this.paymentDay;
  }
}