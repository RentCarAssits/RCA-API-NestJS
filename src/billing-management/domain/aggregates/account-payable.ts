import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AccountPayableId } from '../values/account-payable-id.value';
import { PayerIdFk } from '../values/payer-id-fk.value';
import { PayeeIdFk } from '../values/payee-id-fk.value';
import { Price } from '../values/price.value';
import { PaymentStatus } from '../enums/payment-status.enum';

@Entity('account_payables')
export class AccountPayableAggregate extends AggregateRoot {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: AccountPayableId;

  @Column((type) => PayerIdFk, { prefix: false })
  payerId: PayerIdFk;

  @Column((type) => PayeeIdFk, { prefix: false })
  payeeId: PayeeIdFk;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @Column({ type: 'date', name: 'expiration_day' })
  private expirationDay: Date;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  private readonly state: PaymentStatus;

  constructor(
    payerId: PayerIdFk,
    payeeId: PayeeIdFk,
    price: Price,
    state: number,
    expirationDay: Date
  ) {
    super();
    this.payerId = payerId;
    this.payeeId = payeeId;
    this.price = price;
    this.state = state;
    this.expirationDay = expirationDay;
  }

  public getId(): AccountPayableId {
    return this.id;
  }

  public getPayerId(): PayerIdFk {
    return this.payerId;
  }

  public getPayeeId(): PayeeIdFk {
    return this.payeeId;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getState(): PaymentStatus {
    return this.state;
  }
  
  public getExpirationDay(): Date {
    return this.expirationDay;
  }
}