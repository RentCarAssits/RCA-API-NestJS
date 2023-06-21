import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AccountPayableId } from '../values/account-payable-id.value';
import { PayerIdFk } from '../values/payer-id-fk.value';
import { PayeeIdFk } from '../values/payee-id-fk.value';
import { Price } from '../values/price.value';

@Entity('account_payables')
export class AccountPayableAggregate extends AggregateRoot {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: AccountPayableId;

  @Column((type) => PayerIdFk, { prefix: false })
  private readonly payerId: PayerIdFk;

  @Column((type) => PayeeIdFk, { prefix: false })
  private readonly payeeId: PayeeIdFk;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @Column({ type: 'date', name: 'expiration_day' })
  private expirationDay: Date;

  constructor(
    payerIdValue: PayerIdFk,
    payeeIdValue: PayeeIdFk,
    price: Price,
    expirationDay: Date
  ) {
    super();
    this.payerId = payerIdValue;
    this.payeeId = payeeIdValue;
    this.price = price;
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

  public getExpirationDay(): Date {
    return this.expirationDay;
  }
}