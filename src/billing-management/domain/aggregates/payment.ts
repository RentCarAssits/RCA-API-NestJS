import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentId } from '../values/Payment-id.value';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PayerIdFk } from '../values/payer-id-fk.value';

@Entity('payments')
export class PaymentAggregate extends AggregateRoot {
  @PrimaryGeneratedColumn()
  id: PaymentId;

  @Column((type) => PayerIdFk, { prefix: false })
  private readonly payerId: PayerIdFk;

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
    payerId: PayerIdFk,
    paymentMethod: PaymentMethod,
    paymentDay: Date) {
    super();
    this.payerId = payerId;
    this.paymentMethod = paymentMethod;
    this.paymentDay = paymentDay;
  }

  public getId(): PaymentId {
    return this.id;
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